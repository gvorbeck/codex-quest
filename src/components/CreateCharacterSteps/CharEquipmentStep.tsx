import React, { useEffect, useState } from "react";
import { CharEquipmentStepProps, EquipmentItem } from "../types";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { Button, Divider, InputNumber, Space, Spin } from "antd";
import calculateCarryingCapacity from "../calculateCarryingCapacity";
import PurchasedEquipment from "./PurchasedEquipment";
import EquipmentSelector from "./EquipmentSelector";

const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
  event.target.select();
};

const roller = new DiceRoller();

export default function CharEquipmentStep({
  characterData,
  setCharacterData,
  equipmentItems,
}: CharEquipmentStepProps) {
  const [equipmentCategories, setEquipmentCategories] = useState<
    string[] | null
  >(null);
  const [armorSelection, setArmorSelection] = useState<EquipmentItem | null>(
    null
  );

  const weightRestrictions = calculateCarryingCapacity(
    +characterData.abilities.scores.strength,
    characterData.race
  );

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

  const updateStartingGold = (startingGold: number | null) => {
    // startingGold !== null && setGold(startingGold);
    console.log("blarbs");
    startingGold !== null &&
      setCharacterData({ ...characterData, gold: startingGold });
  };

  const updateArmorSelection = (itemName: string) => {
    const item = equipmentItems.find((item) => item.name === itemName);
    if (item) {
      const updatedEquipment = characterData.equipment.filter(
        (notArmor: EquipmentItem) => notArmor.category !== "armor-and-shields"
      );
      // setEquipment([...updatedEquipment, item]);
      setCharacterData({
        ...characterData,
        equipment: [...updatedEquipment, item],
      });
      setArmorSelection(item);
    }
  };

  const handleWeightChange = () => {
    let newWeight = 0;
    characterData.equipment.forEach(
      (item) => item.weight && (newWeight += item.weight * item.amount)
    );
    // setWeight(newWeight);
    setCharacterData({ ...characterData, weight: newWeight });
  };

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
      if (
        !characterData.equipment.find((item) => item.name === noArmorItem.name)
      ) {
        // setEquipment([...equipment, noArmorItem]);
        setCharacterData({
          ...characterData,
          equipment: [...characterData.equipment, noArmorItem],
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentItems]);

  useEffect(() => {
    handleWeightChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterData.equipment]);

  if (!equipmentCategories) return <Spin />;

  return (
    <>
      <Space.Compact>
        <InputNumber
          max={180}
          min={30}
          defaultValue={0}
          onChange={(value: number | null) => {
            setCharacterData({ ...characterData, gold: Number(value) });
          }}
          onFocus={handleFocus}
          type="number"
          value={Number(characterData.gold.toFixed(2))}
        />
        <Button type="primary" onClick={rollStartingGold}>
          Roll 3d6x10
        </Button>
      </Space.Compact>
      <Divider orientation="left">Equipment Lists</Divider>
      <Space>
        <EquipmentSelector
          armorSelection={armorSelection}
          equipmentCategories={equipmentCategories}
          equipmentItems={equipmentItems}
          handleWeightChange={handleWeightChange}
          updateArmorSelection={updateArmorSelection}
          weightRestrictions={weightRestrictions}
          characterData={characterData}
          setCharacterData={setCharacterData}
        />
        <PurchasedEquipment
          characterData={characterData}
          setCharacterData={setCharacterData}
        />
      </Space>
    </>
  );
}
