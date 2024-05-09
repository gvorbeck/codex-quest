import React from "react";
import { useNotification } from "./useNotification";
import { CharData, EquipmentItem } from "@/data/definitions";
import {
  getRollToAmmoDamageResult,
  getRollToHitResult,
  getRollToThrownDamageResult,
  getWeapon,
} from "@/components/ModalAttack/ModalAttackSupport";

interface UseAttackReturnType {
  range: string | undefined;
  setRange: (range: string | undefined) => void;
  contextHolder: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
  openNotification: (
    title: string,
    description: string,
    duration?: number,
  ) => void;
  getRangeOptions: (range: EquipmentItem["range"]) =>
    | {
        label: string;
        value: string;
      }[]
    | undefined;
  handleRangeChange: (value: string) => void;
  updateEquipmentAfterMissileAttack: (
    ammoSelection: string | undefined,
    isRecoveryChecked: boolean,
    character: CharData,
    setCharacter: React.Dispatch<React.SetStateAction<CharData>>,
  ) => boolean;
  calculateMissileRollResults: (
    character: CharData,
    range: string | undefined,
    ammoSelection: string | undefined,
    thrown?: boolean,
  ) => {
    rollToHit: any;
    rollToDamage: any;
  };
}

export const useAttack = (): UseAttackReturnType => {
  const [range, setRange] = React.useState<string | undefined>(undefined);
  const { contextHolder, openNotification } = useNotification();
  const getRangeOptions = (range: EquipmentItem["range"]) =>
    range?.map((r, index) => {
      const rangeLabel = () => {
        switch (index) {
          case 0:
            return "S";
          case 1:
            return "M";
          case 2:
            return "L";
          default:
            return "";
        }
      };
      return {
        label: `${rangeLabel()}/${r}'`,
        value: rangeLabel(),
      };
    });
  const handleRangeChange = (value: string) => {
    setRange(value);
  };
  const updateEquipmentAfterMissileAttack = (
    ammoSelection: string | undefined,
    isRecoveryChecked: boolean,
    character: CharData,
    setCharacter: React.Dispatch<React.SetStateAction<CharData>>,
  ) => {
    const weapon = getWeapon(ammoSelection ?? "", character.equipment);
    if (weapon) {
      const newEquipment = character.equipment.filter(
        (item) => item.name !== ammoSelection,
      );
      const weaponRecovered = isRecoveryChecked && Math.random() < 0.25;

      if (weaponRecovered) {
        newEquipment.push(weapon);
      } else {
        weapon.amount = weapon.amount - 1;
        if (weapon.amount > 0) newEquipment.push(weapon);
      }

      setCharacter((prevCharacter) => ({
        ...prevCharacter,
        equipment: [...newEquipment],
      }));

      return weaponRecovered;
    }
    return false;
  };

  const calculateMissileRollResults = (
    character: CharData,
    range: string | undefined,
    ammoSelection: string | undefined,
    thrown: boolean = false,
  ) => {
    const rollToHit = getRollToHitResult(character, "missile", range);
    let rollToDamage;
    if (thrown) {
      rollToDamage = getRollToThrownDamageResult(
        character.equipment,
        ammoSelection,
        character,
      );
    } else {
      rollToDamage = getRollToAmmoDamageResult(
        character.equipment,
        ammoSelection,
        character,
      );
    }
    return { rollToHit, rollToDamage };
  };

  return {
    range,
    setRange,
    contextHolder,
    openNotification,
    getRangeOptions,
    handleRangeChange,
    updateEquipmentAfterMissileAttack,
    calculateMissileRollResults,
  };
};
