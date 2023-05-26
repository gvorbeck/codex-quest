import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { EquipmentCheckboxProps, EquipmentItem } from "../types";
import { InputNumber, Space, Typography } from "antd";

export default function EquipmentCheckbox({
  itemName,
  equipmentItems,
  equipment,
  setEquipment,
  setGold,
  gold,
  handleWeightChange,
  weight,
  weightRestrictions,
  race,
}: EquipmentCheckboxProps) {
  const item = equipmentItems.find((item) => item.name === itemName);
  const isHalflingOrDwarf = race === "Halfling" || race === "Dwarf";

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
        setEquipment([...equipment, item]);
        setGold(gold - realCost * item.amount);
      } else {
        setEquipment(
          [...equipment].filter(
            (equipmentItem) => equipmentItem.name !== item.name
          )
        );
        setGold(gold + realCost * item.amount);
        item.amount = 1;
      }
    };

  const handleAmountChange = (value: number | null) => {
    if (value !== null) {
      const prevAmount = item.amount;
      const delta = value - prevAmount; // calculate the change in amount
      setGold(gold - realCost * delta); // update the gold
      item.amount = value; // update the item amount
      handleWeightChange();
    }
  };

  const isChecked = equipment.some(
    (equipmentItem) => equipmentItem.name === item.name
  );

  return (
    <Space direction="vertical">
      <Checkbox
        onChange={updatedEquipmentSelections(item)}
        checked={isChecked}
        disabled={
          (!isChecked && gold <= 0) ||
          (!isChecked && realCost > gold) ||
          (!isChecked && weight >= weightRestrictions.heavy) ||
          (isHalflingOrDwarf && item.size === "L")
        }
      >
        <Space direction="vertical">
          <Typography.Text strong>{item.name}</Typography.Text>
          <Typography.Text>{`Cost: ${item.costValue}${item.costCurrency}`}</Typography.Text>
          {item.weight && (
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
            gold <= 0 || realCost > gold || weight >= weightRestrictions.heavy
          }
          onChange={handleAmountChange}
          value={item.amount}
        />
      )}
    </Space>
  );
}
