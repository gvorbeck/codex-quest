import { EquipmentStoreProps } from "./definitions";
import EquipmentAccordion from "./EquipmentAccordion/EquipmentAccordion";
import { useEffect, useState } from "react";
import equipmentItems from "../../data/equipmentItems.json";
import EquipmentInventory from "./EquipmentInventory/EquipmentInventory";
import { useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import HomebrewWarning from "../HomebrewWarning/HomebrewWarning";
import { getItemCost } from "../../support/formatSupport";
import GoldRoller from "./GoldRoller/GoldRoller";
import { ClassNames, EquipmentItem, RaceNames } from "../../data/definitions";

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
        totalAddedCost += getItemCost(newItem);
      } else if (oldItem.amount !== newItem.amount) {
        // The amount has changed, calculate the cost difference
        const amountDifference = newItem.amount - oldItem.amount;
        const costDifference =
          amountDifference * getItemCost({ ...newItem, amount: 1 });

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
        totalRemovedCost += getItemCost(oldItem);
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
    <>
      {!Object.values(RaceNames).includes(characterData.race as RaceNames) &&
        !characterData.class.some((className) =>
          Object.values(ClassNames).includes(className as ClassNames)
        ) && <HomebrewWarning homebrew="Race or Class" className="mb-4" />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {inBuilder && (
          <GoldRoller
            characterData={characterData}
            setCharacterData={setCharacterData}
            goldInputValue={goldInputValue}
            setGoldInputValue={setGoldInputValue}
          />
        )}
        <EquipmentAccordion
          onAmountChange={onAmountChange}
          onCheckboxCheck={onCheckboxCheck}
          onRadioCheck={onRadioCheck}
          characterData={characterData}
        />
        <EquipmentInventory characterData={characterData} />
      </div>
    </>
  );
}
