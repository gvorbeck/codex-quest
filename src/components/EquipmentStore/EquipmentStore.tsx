import { ClassName, EquipmentItem, EquipmentStoreProps } from "./definitions";
import EquipmentAccordion from "../EquipmentAccordion/EquipmentAccordion";
import { RaceName } from "../CharacterRace/definitions";
import { Button, InputNumber, Space } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { useEffect, useState } from "react";
import equipmentItems from "../../data/equipment-items.json";
import EquipmentInventory from "../EquipmentInventory/EquipmentInventory";

const roller = new DiceRoller();

export default function EquipmentStore({
  characterData,
  setCharacterData,
  inBuilder,
}: EquipmentStoreProps) {
  const [equipmentValue, setEquipmentValue] = useState(0);

  const inventoryChange = () => {
    // Calculate total cost of selected equipment
    const totalEquipmentCost = characterData.equipment.reduce(
      (total, equipmentItem) => {
        let cost = equipmentItem.costValue;
        if (equipmentItem.costCurrency === "sp") cost *= 0.1;
        if (equipmentItem.costCurrency === "cp") cost *= 0.01;
        return total + cost * equipmentItem.amount;
      },
      0
    );

    // Calculate total weight of selected equipment
    const totalEquipmentWeight = characterData.equipment.reduce(
      (total, equipmentItem) => {
        return total + (equipmentItem.weight || 0) * equipmentItem.amount;
      },
      0
    );

    let newGoldValue = characterData.gold;
    if (totalEquipmentCost < equipmentValue) {
      console.log("totalEquipmentCost < equipmentValue");
      newGoldValue = characterData.gold + (equipmentValue - totalEquipmentCost);
    } else if (totalEquipmentCost > equipmentValue) {
      console.log("totalEquipmentCost > equipmentValue");
      newGoldValue = characterData.gold - (totalEquipmentCost - equipmentValue);
    }

    if (newGoldValue !== characterData.gold) {
      setCharacterData({
        ...characterData,
        gold: newGoldValue,
        weight: totalEquipmentWeight,
      });
    }
    setEquipmentValue(totalEquipmentCost);

    // TODO
    // if some var like updateFirebase run some async firebase fn
    // combo class split/run fn/add to set
    // racial limitations
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

  const handleRollStartingGoldClick = () => {
    setCharacterData({ ...characterData, gold: roller.roll("3d6*10").total });
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

  useEffect(() => {
    console.log(characterData);
    inventoryChange();
  }, [characterData.equipment]);

  return (
    <div className="sm:grid grid-cols-2 gap-8">
      {inBuilder && (
        <Space.Compact className="col-span-2">
          <InputNumber
            min={30}
            max={180}
            defaultValue={0}
            value={Number(characterData.gold.toFixed(2))}
            onFocus={(event) => event.target.select()}
          />
          <Button
            aria-label="Roll for starting gold"
            type="primary"
            onClick={handleRollStartingGoldClick}
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
      />
      <EquipmentInventory characterData={characterData} />
    </div>
  );
}
