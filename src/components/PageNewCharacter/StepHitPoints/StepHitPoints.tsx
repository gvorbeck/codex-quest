import { CharData, CharDataAction, DiceTypes } from "@/data/definitions";
import {
  Button,
  Flex,
  InputNumber,
  Select,
  SelectProps,
  Space,
  Tooltip,
} from "antd";
import { rollDice } from "@/support/diceSupport";
import React from "react";
import { getClassType } from "@/support/classSupport";
import { getCharacterHitDiceFromClass } from "@/support/statSupport";

interface StepHitPointsProps {
  character: CharData;
  characterDispatch: React.Dispatch<CharDataAction>;
}

const StepHitPoints: React.FC<
  StepHitPointsProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, characterDispatch }) => {
  const [hitDie, setHitDie] = React.useState<DiceTypes | undefined>(
    getCharacterHitDiceFromClass(character),
  );

  let showDieSelector = false;

  if (!hitDie || getClassType(character.class)[0] === "custom")
    showDieSelector = true;

  const options: SelectProps["options"] = Object.values(DiceTypes).map(
    (die: string) => ({ label: die, value: die }),
  );

  function handleRollHitDieClick() {
    if (!hitDie) return;
    const rolledHP = rollDice(
      `1${hitDie}${character.abilities.modifiers.constitution}`,
    );
    const hpScore = rolledHP < 1 ? 1 : rolledHP;
    characterDispatch({
      type: "SET_HP",
      payload: {
        dice: hitDie as DiceTypes,
        points: hpScore,
        setMax: true,
      },
    });
  }

  function handleHitDieSelectChange(value: DiceTypes | undefined) {
    setHitDie(value);
  }

  function handleHitDieInputNumberChange(value: number | undefined | null) {
    characterDispatch({
      type: "SET_HP",
      payload: {
        points: value ?? 0,
      },
    });
  }

  function handleMaxHPClick() {
    if (!hitDie) return;
    const maxHP =
      +hitDie.split("d")[1] +
      parseInt(character.abilities.modifiers.constitution as string);
    characterDispatch({
      type: "SET_HP",
      payload: {
        dice: hitDie as DiceTypes,
        points: maxHP,
        setMax: true,
      },
    });
  }

  return (
    <Flex vertical className={className} gap={16}>
      {showDieSelector && (
        <Select
          options={options}
          onChange={handleHitDieSelectChange}
          placeholder="Select a die for your custom class"
          value={hitDie}
        />
      )}
      <Flex gap={8}>
        <Space.Compact>
          <InputNumber
            className="pb-0.5"
            defaultValue={0}
            min={1}
            value={character.hp.points}
            onChange={handleHitDieInputNumberChange}
          />
          <Tooltip title={hitDie === undefined && "Select a die to roll"}>
            <Button
              type="primary"
              onClick={handleRollHitDieClick}
              disabled={hitDie === undefined}
            >
              Roll 1{hitDie}
              {character.abilities.modifiers.constitution}
            </Button>
          </Tooltip>
        </Space.Compact>
        <Button disabled={hitDie === undefined} onClick={handleMaxHPClick}>
          Max HP
        </Button>
      </Flex>
    </Flex>
  );
};

export default StepHitPoints;
