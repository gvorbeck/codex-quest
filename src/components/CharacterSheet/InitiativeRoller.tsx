import { Button } from "antd";
import { CharacterDetails } from "../types";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

export default function InitiativeRoller({ character }: CharacterDetails) {
  const roller = new DiceRoller();

  const rollInitiative = () => {
    const result = roller.roll(
      `1d6+${+character.abilities.modifiers.dexterity}`
    );
    if (!(result instanceof Array) && result.total > 0) return result.total;
    else return 1;
  };
  return (
    <Button onClick={() => console.log(rollInitiative())}>
      Roll Initiative
    </Button>
  );
}
