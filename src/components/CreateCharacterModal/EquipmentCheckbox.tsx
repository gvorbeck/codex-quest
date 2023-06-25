import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { EquipmentCheckboxProps, EquipmentItem } from "../types";
import { InputNumber, Space, Typography } from "antd";

export default function EquipmentCheckbox({
  itemName,
  equipmentItems,
  handleWeightChange,
  weightRestrictions,
  characterData,
  setCharacterData,
}: EquipmentCheckboxProps) {
  const item = equipmentItems.find((item) => item.name === itemName);
  const isHalflingOrDwarf =
    characterData.race === "Halfling" || characterData.race === "Dwarf";

  if (!item) return null;

  const realCost =
    item.costCurrency === "gp"
      ? item.costValue
      : item.costCurrency === "sp"
      ? item.costValue / 10
      : item.costValue / 100;

  const updatedEquipmentSelections =
    (item: EquipmentItem) => (event: CheckboxChangeEvent) => {
      if (event.target.checked) {
        setCharacterData({
          ...characterData,
          equipment: [...characterData.equipment, item],
          gold: characterData.gold - realCost * item.amount,
        });
      } else {
        setCharacterData({
          ...characterData,
          equipment: [...characterData.equipment].filter(
            (equipmentItem) => equipmentItem.name !== item.name
          ),
          gold: characterData.gold + realCost * item.amount,
        });
        item.amount = 1;
      }
    };

  const handleAmountChange = (value: number | null) => {
    if (value !== null) {
      const prevAmount = item.amount;
      const delta = value - prevAmount; // calculate the change in amount
      const newGoldAmount = characterData.gold - realCost * delta;
      setCharacterData({
        ...characterData,
        gold: newGoldAmount,
      });
      item.amount = value; // update the item amount
      handleWeightChange();
    }
  };

  const isChecked = characterData.equipment.some(
    (equipmentItem) => equipmentItem.name === item.name
  );

  return (
    <Space direction="vertical">
      <Checkbox
        onChange={updatedEquipmentSelections(item)}
        checked={isChecked}
        disabled={
          // If 0 gold and item is UNCHECKED
          (!isChecked && characterData.gold <= 0) ||
          // If UNCHECKED and item costs more gold than character currently has
          (!isChecked && realCost > characterData.gold) ||
          // If UNCHECKED and character is carrying too much
          (!isChecked && characterData.weight >= weightRestrictions.heavy) ||
          // If character is a Dwarf or Halfling and item is of size L
          (isHalflingOrDwarf && item.size === "L") ||
          // If character is a Cleric/Magic-User and category is Axes
          ((characterData.class === "Cleric" ||
            characterData.class === "Magic-User") &&
            item.category === "axes") ||
          // If character is a Cleric/Magic-User and category is Bows
          ((characterData.class === "Cleric" ||
            characterData.class === "Magic-User") &&
            item.category === "bows") ||
          // If character is a Cleric and category is Ammunition (except "Stone")
          (characterData.class === "Cleric" &&
            item.category === "ammunition" &&
            item.name !== "Stone") ||
          // If character is a Magic-User and category is Hammers and Maces
          (characterData.class === "Magic-User" &&
            item.category === "hammers-and-maces") ||
          // If character is a Magic-User and category is Ammunition
          (characterData.class === "Magic-User" &&
            item.category === "ammunition") ||
          // If character is a Cleric and category is Daggers
          (characterData.class === "Cleric" && item.category === "daggers") ||
          // If character is a Cleric and category is Other Weapons and is spear or pole arm
          (characterData.class === "Cleric" &&
            item.category === "other-weapons" &&
            (item.name === "Pole Arm" || item.name === "Spear")) ||
          // If character is a Magic-User and category is Other Weapons and is not walking staff
          (characterData.class === "Magic-User" &&
            item.category === "other-weapons" &&
            item.name !== "Club/Cudgel/Walking Staff") ||
          // If character is a Cleric/Magic-User and category is Swords
          ((characterData.class === "Cleric" ||
            characterData.class === "Magic-User") &&
            item.category === "swords")
        }
      >
        <Space direction="vertical">
          <Typography.Text strong>{item.name}</Typography.Text>
          <Typography.Text>{`Cost: ${item.costValue}${item.costCurrency}`}</Typography.Text>
          {item.weight !== undefined ?? (
            <Typography.Text>{`Weight: ${item.weight}`}</Typography.Text>
          )}
          {item.damage && (
            <Typography.Text>{`Damage: ${item.damage}`}</Typography.Text>
          )}
          {item.size && (
            <Typography.Text>{`Size: ${item.size}`}</Typography.Text>
          )}
        </Space>
      </Checkbox>
      {isChecked && (
        <InputNumber
          min={1}
          defaultValue={1}
          disabled={
            characterData.gold <= 0 ||
            realCost > characterData.gold ||
            characterData.weight >= weightRestrictions.heavy
          }
          onChange={handleAmountChange}
          value={item.amount}
        />
      )}
    </Space>
  );
}
