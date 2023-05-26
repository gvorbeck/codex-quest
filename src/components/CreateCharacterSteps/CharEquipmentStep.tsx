import React, { useEffect, useState } from "react";
import {
  CharEquipmentStepProps,
  EquipmentItem,
  EquipmentCheckboxProps,
} from "../types";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  InputNumber,
  Radio,
  Space,
  Spin,
  Typography,
} from "antd";
import { toTitleCase } from "../formatters";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import calculateCarryingCapacity from "../calculateCarryingCapacity";

const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
  event.target.select();
};

const roller = new DiceRoller();

const EquipmentCheckbox = ({
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
}: EquipmentCheckboxProps) => {
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
};

function EquipmentRadio({ item }: { item: EquipmentItem }) {
  return (
    <Radio value={item.name}>
      <Space direction="vertical">
        <Typography.Text strong>{item.name}</Typography.Text>
        <Typography.Text>{`Cost: ${item.costValue}${item.costCurrency}`}</Typography.Text>
        <Typography.Text>{`AC: ${item.AC}`}</Typography.Text>
        <Typography.Text>{`Weight: ${item.weight}`}</Typography.Text>
      </Space>
    </Radio>
  );
}

export default function CharEquipmentStep({
  gold,
  setGold,
  equipment,
  setEquipment,
  race,
  weight,
  setWeight,
  strength,
}: CharEquipmentStepProps) {
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([]);
  const [equipmentCategories, setEquipmentCategories] = useState<
    string[] | null
  >(null);
  const [armorSelection, setArmorSelection] = useState<EquipmentItem | null>(
    null
  );

  const weightRestrictions = calculateCarryingCapacity(strength, race);

  const rollStartingGold = () => {
    const result = roller.roll("3d6*10");
    if (!(result instanceof Array) && result.total !== null)
      updateStartingGold(result.total);
  };

  const getCategories = () => {
    let categoriesSet = new Set<string>();
    if (equipmentItems.length > 0) {
      equipmentItems.forEach((item) => categoriesSet.add(item.category));
    } else return null;
    return [...categoriesSet];
  };

  const updateStartingGold = (startingGold: number | null) =>
    startingGold !== null && setGold(startingGold);

  const updateArmorSelection = (itemName: string) => {
    const item = equipmentItems.find((item) => item.name === itemName);
    if (item) {
      const updatedEquipment = equipment.filter(
        (notArmor: EquipmentItem) => notArmor.category !== "armor-and-shields"
      );
      setEquipment([...updatedEquipment, item]);
      setArmorSelection(item);
    }
  };

  const handleWeightChange = () => {
    let newWeight = 0;
    equipment.forEach(
      (item) => item.weight && (newWeight += item.weight * item.amount)
    );
    setWeight(newWeight);
  };

  /**
   * Side-effect for when component mounts
   * Fetches "equipment" collection from Firestore and adds "amount" property to each element
   * Sets the equipmentItems state array
   */
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const coll = collection(db, "equipment");
        const snapshot = await getDocs(coll);
        const dataArray = snapshot.docs.map((doc) => ({
          ...(doc.data() as EquipmentItem),
          amount: 1,
        }));
        setEquipmentItems(dataArray);
      } catch (error) {
        console.error("Error fetching equipment: ", error);
      }
    };
    fetchEquipment();

    console.log(race, strength, weightRestrictions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Side-effect for when equipmentItems are retrieved from Firestore.
   * Sets equipmentCategories state array
   * Sets armorSelection state object
   * Adds "No Armor" object to equipment state array
   */
  useEffect(() => {
    setEquipmentCategories(getCategories());
    const noArmorItem = equipmentItems.find(
      (noArmor: EquipmentItem) => noArmor.name === "No Armor"
    );

    if (noArmorItem) {
      setArmorSelection(noArmorItem);

      // Add the "No Armor" item to the equipment array if it doesn't exist yet
      if (!equipment.find((item) => item.name === noArmorItem.name)) {
        setEquipment([...equipment, noArmorItem]);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentItems]);

  useEffect(() => {
    console.log(equipment);
    handleWeightChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipment]);

  useEffect(() => {
    console.log(weight);
  }, [weight]);

  if (!equipmentCategories) return <Spin />;

  return (
    <>
      <Space.Compact>
        <InputNumber
          max={180}
          min={30}
          defaultValue={0}
          onChange={(value: number | null) => setGold(value || 0)}
          onFocus={handleFocus}
          type="number"
          value={+gold.toFixed(2)}
        />
        <Button type="primary" onClick={rollStartingGold}>
          Roll 3d6x10
        </Button>
      </Space.Compact>
      <Divider orientation="left">Equipment Lists</Divider>
      <Collapse accordion>
        {equipmentCategories
          .sort((a, b) => a.localeCompare(b))
          .map((cat) => (
            <Collapse.Panel
              header={toTitleCase(cat.replaceAll("-", " "))}
              key={cat}
            >
              {cat !== "armor-and-shields" ? (
                <Space direction="vertical">
                  {equipmentItems
                    .filter((catItem) => catItem.category === cat)
                    .map((item) => (
                      <EquipmentCheckbox
                        key={item.name}
                        itemName={item.name}
                        equipmentItems={equipmentItems}
                        equipment={equipment}
                        setEquipment={setEquipment}
                        setGold={setGold}
                        gold={gold}
                        handleWeightChange={handleWeightChange}
                        weight={weight}
                        weightRestrictions={weightRestrictions}
                        race={race}
                      />
                    ))}
                </Space>
              ) : (
                <Radio.Group
                  value={armorSelection ? armorSelection.name : null}
                  onChange={(e) => updateArmorSelection(e.target.value)}
                >
                  <Space direction="vertical">
                    {equipmentItems
                      .filter((catItem) => catItem.category === cat)
                      .map((item) => (
                        <React.Fragment key={item.name}>
                          <EquipmentRadio item={item} />
                          <Divider />
                        </React.Fragment>
                      ))}
                  </Space>
                </Radio.Group>
              )}
            </Collapse.Panel>
          ))}
      </Collapse>
    </>
  );
}
