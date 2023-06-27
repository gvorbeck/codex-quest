import { ClassName, EquipmentItem, EquipmentStoreProps } from "./definitions";
import EquipmentAccordion from "./EquipmentAccordion/EquipmentAccordion";
import { RaceName } from "../CharacterRace/definitions";
import { Button, InputNumber, Space } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { useEffect, useState } from "react";
import equipmentItems from "../../data/equipment-items.json";
import EquipmentInventory from "./EquipmentInventory/EquipmentInventory";
import { useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const roller = new DiceRoller();

export default function EquipmentStore({
  characterData,
  setCharacterData,
  inBuilder,
}: EquipmentStoreProps) {
  const [prevValue, setPrevValue] = useState(characterData.equipment);
  const [goldInputValue, setGoldInputValue] = useState(characterData.gold);

  const { uid, id } = useParams();

  const updateEquipment = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    if (characterData.equipment !== prevValue) {
      const docRef = doc(db, "users", uid, "characters", id);

      try {
        await updateDoc(docRef, {
          equipment: characterData.equipment,
          gold: characterData.gold,
        });
        setPrevValue(characterData.equipment);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const inventoryChange = () => {
    const newItems = characterData.equipment;
    const oldItems = prevValue;

    let totalAddedCost = 0;
    let totalRemovedCost = 0;

    newItems.forEach((newItem) => {
      const oldItem = oldItems.find((item) => item.name === newItem.name);

      if (!oldItem) {
        // The item is new, add its cost
        totalAddedCost += calculateItemCost(newItem);
      } else if (oldItem.amount !== newItem.amount) {
        // The amount has changed, calculate the cost difference
        const amountDifference = newItem.amount - oldItem.amount;
        const costDifference =
          amountDifference * calculateItemCost({ ...newItem, amount: 1 });

        if (amountDifference > 0) {
          // The amount has increased, add the cost difference
          totalAddedCost += costDifference;
        } else {
          // The amount has decreased, subtract the cost difference
          totalRemovedCost -= costDifference;
        }
      }
    });

    // Check for items that were removed entirely
    oldItems.forEach((oldItem) => {
      if (!newItems.find((item) => item.name === oldItem.name)) {
        // The item was removed, subtract its cost
        totalRemovedCost += calculateItemCost(oldItem);
      }
    });

    const totalEquipmentWeight = characterData.equipment.reduce(
      (total, equipmentItem) => {
        return total + (equipmentItem.weight || 0) * equipmentItem.amount;
      },
      0
    );

    let newGoldValue = characterData.gold;

    // Deduct the cost of added items and add the cost of removed items
    newGoldValue -= totalAddedCost;
    newGoldValue += totalRemovedCost;

    // Update characterData with new gold value
    if (newGoldValue !== characterData.gold) {
      setCharacterData({
        ...characterData,
        gold: newGoldValue,
        weight: totalEquipmentWeight,
      });
    }

    setPrevValue(newItems); // Update previous equipment state

    // If this is not inside the Character Builder, update the character's equipment
    if (!inBuilder) {
      updateEquipment();
    }
  };

  const calculateItemCost = (item: EquipmentItem) => {
    let cost = item.costValue;
    if (item.costCurrency === "sp") cost *= 0.1;
    if (item.costCurrency === "cp") cost *= 0.01;
    return cost * item.amount;
  };

  const onCheckboxCheck = (item?: EquipmentItem, checked?: boolean) => {
    if (checked) {
      const updatedItems = characterData.equipment.concat(item || []);
      setCharacterData({ ...characterData, equipment: updatedItems });
    } else {
      const filteredItems = characterData.equipment.filter(
        (equipmentItem) => equipmentItem.name !== item?.name
      );
      setCharacterData({ ...characterData, equipment: filteredItems });
    }
  };

  const onAmountChange = (item?: EquipmentItem) => {
    const filteredItems = characterData.equipment.filter(
      (equipmentItem) => equipmentItem.name !== item?.name
    );
    const updatedItems = filteredItems.concat(item || []);
    setCharacterData({ ...characterData, equipment: updatedItems });
  };

  const onRadioCheck = (item?: EquipmentItem) => {
    const filteredItems = characterData.equipment.filter(
      (equipmentItem) =>
        equipmentItem.name !== item?.name &&
        !equipmentItem.name.toLowerCase().includes("armor") &&
        !equipmentItem.name.toLowerCase().includes("mail")
    );
    const updatedItems = filteredItems.concat(item || []);
    setCharacterData({ ...characterData, equipment: updatedItems });
  };

  // Update inputValue when typing in the InputNumber field
  const handleGoldInputChange = (value: number | null) => {
    setGoldInputValue(value || 0);
    setCharacterData({ ...characterData, gold: value || 0 });
  };

  // On page load, add "No Armor"
  useEffect(() => {
    if (inBuilder) {
      // If this is inside the Character Builder, remove all armors and add "No Armor"
      const filteredItems = characterData.equipment.filter(
        (equipmentItem) =>
          !equipmentItem.name.toLowerCase().includes("armor") &&
          !equipmentItem.name.toLocaleLowerCase().includes("mail") &&
          !equipmentItem.name.toLowerCase().includes("shield")
      );

      const noArmor = equipmentItems.filter(
        (equipmentItem) => equipmentItem.name.toLowerCase() === "no armor"
      );
      const updatedItems = filteredItems.concat(noArmor);

      setCharacterData({
        ...characterData,
        equipment: updatedItems,
      });
    }
  }, []);

  // On Equipment change, update gold and weight
  useEffect(() => {
    inventoryChange();
  }, [characterData.equipment]);

  // Update inputValue when characterData.gold changes
  useEffect(() => {
    setGoldInputValue(characterData.gold);
  }, [characterData.gold]);

  return (
    <div className="sm:grid grid-cols-2 gap-8">
      {inBuilder && (
        <Space.Compact className="col-span-2">
          <InputNumber
            min={30}
            max={180}
            defaultValue={0}
            value={Number(goldInputValue.toFixed(2))}
            onFocus={(event) => event.target.select()}
            onChange={handleGoldInputChange}
          />
          <Button
            aria-label="Roll for starting gold"
            type="primary"
            onClick={() => handleGoldInputChange(roller.roll("3d6*10").total)}
          >
            Roll 3d6x10
          </Button>
        </Space.Compact>
      )}
      <EquipmentAccordion
        onAmountChange={onAmountChange}
        onCheckboxCheck={onCheckboxCheck}
        onRadioCheck={onRadioCheck}
        playerClass={characterData.class as ClassName}
        playerEquipment={characterData.equipment}
        playerRace={characterData.race as RaceName}
        playerGold={characterData.gold}
      />
      <EquipmentInventory characterData={characterData} />
    </div>
  );
}
