import { AbilityRecord } from "../definitions";

export type AbilityRollerProps = {
  rollDice: () => any;
  abilityValue: number;
  getModifier: (score: number) => string;
  updateCharacterData: (
    scores: Record<string, number>,
    modifiers: Record<string, string>
  ) => void;
  record: AbilityRecord;
};
