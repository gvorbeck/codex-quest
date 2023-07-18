import { Button, Tooltip, notification } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { InitiativeRollerProps } from "./definitions";

const openNotification = (result: number) => {
  notification.open({
    message: "Initiative Roll",
    description: result,
    duration: 0,
    className: "!bg-seaBuckthorn",
  });
};

export default function InitiativeRoller({
  characterData,
}: InitiativeRollerProps) {
  const rollTooltip = `1d6 + DEX modifier ${
    characterData.race === "Halfling" ? "+ 1 as a Halfling" : ""
  }`;
  const roller = new DiceRoller();
  const rollInitiative = () => {
    let result = roller.roll(
      `1d6${characterData.abilities.modifiers.dexterity}${
        characterData.race === "Halfling" ? "+1" : ""
      }`
    );
    if (result.total === 0) result = 1;
    openNotification(result.output);
  };
  return (
    <Tooltip title={rollTooltip}>
      <Button type="primary" onClick={rollInitiative}>
        Roll Initiative
      </Button>
    </Tooltip>
  );
}
