import React, { useEffect, useState } from "react";
import { CharEquipmentStepProps, EquipmentItem } from "../types";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
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
  gold,
  setGold,
  equipment,
  setEquipment,
  race,
  weight,
  setWeight,
  strength,
  equipmentItems,
  setEquipmentItems,
}: CharEquipmentStepProps) {
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
    if (equipmentItems.length === 0) {
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
    }
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
    handleWeightChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipment]);

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
      <Space>
        <EquipmentSelector
          armorSelection={armorSelection}
          equipment={equipment}
          equipmentCategories={equipmentCategories}
          equipmentItems={equipmentItems}
          gold={gold}
          handleWeightChange={handleWeightChange}
          race={race}
          setEquipment={setEquipment}
          setGold={setGold}
          updateArmorSelection={updateArmorSelection}
          weight={weight}
          weightRestrictions={weightRestrictions}
        />
        <PurchasedEquipment gold={gold} weight={weight} equipment={equipment} />
      </Space>
    </>
  );
}
