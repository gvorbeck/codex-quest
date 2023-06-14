import React, { useEffect, useState } from "react";
import { CharEquipmentStepProps, EquipmentItem } from "../types";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { Button, Col, Divider, InputNumber, Row, Space, Spin } from "antd";
import calculateCarryingCapacity from "../calculateCarryingCapacity";
import PurchasedEquipment from "./PurchasedEquipment";
import EquipmentSelector from "./EquipmentSelector";

const roller = new DiceRoller();

export default function CharEquipmentStep({
  characterData,
  setCharacterData,
  equipmentItems,
  rollGold,
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

    const noArmorItem = equipmentItems.find(
      (noArmor: EquipmentItem) => noArmor.name === "No Armor"
    );
    if (!(result instanceof Array) && result.total !== null) {
      let equipment;
      if (!armorSelection && noArmorItem) {
        equipment = [...characterData.equipment, noArmorItem];
        setArmorSelection(noArmorItem);
      } else {
        equipment = [...characterData.equipment];
      }
      setCharacterData({
        ...characterData,
        gold: result.total,
        equipment,
      });
    }
  };

  const getCategories = () => {
    let categoriesSet = new Set<string>();
    if (equipmentItems.length > 0) {
      equipmentItems.forEach((item) => categoriesSet.add(item.category));
    } else return null;
    return [...categoriesSet];
  };

  const updateArmorSelection = (itemName: string) => {
    const item = equipmentItems.find((item) => item.name === itemName);
    if (item) {
      const updatedEquipment = characterData.equipment.filter(
        (notArmor: EquipmentItem) => notArmor.category !== "armor-and-shields"
      );
      const costDifference = armorSelection
        ? armorSelection.costValue - item.costValue
        : -item.costValue;
      setCharacterData({
        ...characterData,
        gold: characterData.gold + costDifference,
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
    setCharacterData({ ...characterData, weight: newWeight });
  };

  useEffect(() => {
    setEquipmentCategories(getCategories());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleWeightChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterData.equipment]);

  if (!equipmentCategories) return <Spin />;

  return (
    <>
      {rollGold && (
        <Space.Compact>
          <InputNumber
            max={180}
            min={30}
            defaultValue={0}
            onChange={(value: number | null) => {
              setCharacterData({ ...characterData, gold: Number(value) });
            }}
            onFocus={(event) => event.target.select()}
            type="number"
            value={Number(characterData.gold.toFixed(2))}
          />
          <Button
            aria-label="Roll for starting gold"
            type="primary"
            onClick={rollStartingGold}
          >
            Roll 3d6x10
          </Button>
        </Space.Compact>
      )}
      <Divider orientation="left">Equipment Lists</Divider>
      <Row gutter={32} className="block md:flex">
        <Col xs={24} sm={12}>
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
        </Col>
        <Col xs={24} sm={12} className="sticky top-0 h-full">
          <PurchasedEquipment
            characterData={characterData}
            setCharacterData={setCharacterData}
            weightRestrictions={weightRestrictions}
          />
        </Col>
      </Row>
    </>
  );
}
