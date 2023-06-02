import { Button } from "antd";
import { CharacterDetails } from "../types";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

export default function InitiativeRoller({ character }: CharacterDetails) {
  const roller = new DiceRoller();

  const rollInitiative = () => {
    let result = roller.roll(
      `1d6+${+character.abilities.modifiers.dexterity}`
    ).total;
    if (character.race === "Halfling") result += 1;
    if (result.total > 0) result = 1;
    return result;
  };
  return (
    <Button onClick={() => console.log(rollInitiative())}>
      Roll Initiative
    </Button>
  );
}
