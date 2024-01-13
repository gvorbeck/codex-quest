// Custom Hook for rolling dice for a character.

import { CharData } from "@/data/definitions";
import { rollDice } from "@/support/characterSupport";
import { useNotification } from "./useNotification";

export function useCharacterDice(character: CharData) {
  const { dexterity: dexBonus } = character.abilities.modifiers;
  const { contextHolder, openNotification } = useNotification();

  const rollInitiative = () => {
    const result = rollDice(`1d6${dexBonus}`);
    openNotification("Roll Initiative", result);
  };

  return { contextHolder, rollInitiative };
}
