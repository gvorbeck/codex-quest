import { CharData, ClassNames, DiceTypes, RaceNames } from "@/data/definitions";
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
import { races } from "@/data/races";
import { classes } from "@/data/classes";

interface StepHitPointsProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
}

function getCharacterHitDiceFromClass(character: CharData) {
  const diceArr = [
    DiceTypes.D3,
    DiceTypes.D4,
    DiceTypes.D6,
    DiceTypes.D8,
    DiceTypes.D10,
    DiceTypes.D12,
    DiceTypes.D20,
  ];
  const { race } = character;
  const classType = getClassType(character.class);
  // Some races require the character's hit dice to be incremented or decremented
  const incrementChecker = (dice: DiceTypes) => {
    // The index of the character's hit die in the diceArr
    let diceIndex = diceArr.indexOf(dice);
    // The max index a character's hit die is allowed to be in the diceArr
    const diceMaxIndex = diceArr.indexOf(
      races[race as RaceNames]?.maximumHitDice ?? DiceTypes.D20,
    );
    if (races[race as RaceNames]?.incrementHitDie) {
      diceIndex++;
    }
    if (races[race as RaceNames]?.decrementHitDie) {
      diceIndex--;
    }
    // If a character's hit die is greater than the max allowed hit die, set it to the max allowed hit die
    if (diceIndex > diceMaxIndex) {
      diceIndex = diceMaxIndex;
    }
    return diceArr[diceIndex];
  };
  if (classType[0] === "combination") {
    if (character.class.includes(ClassNames.FIGHTER)) {
      return incrementChecker(DiceTypes.D6);
    }
    if (character.class.includes(ClassNames.THIEF)) {
      return incrementChecker(DiceTypes.D4);
    }
  } else if (classType[0] === "standard") {
    return incrementChecker(classes[character.class[0] as ClassNames].hitDice);
  }
  return (character.hp.dice as DiceTypes) || undefined;
}

const StepHitPoints: React.FC<
  StepHitPointsProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
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
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      hp: {
        dice: hitDie as DiceTypes,
        points: hpScore,
        max:
          +hitDie?.split("d")[1] +
          parseInt(character.abilities.modifiers.constitution as string),
        desc: "",
      },
    }));
  }

  function handleHitDieSelectChange(value: DiceTypes | undefined) {
    setHitDie(value);
  }

  function handleHitDieInputNumberChange(value: number | undefined | null) {
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      hp: {
        ...prevCharacter.hp,
        points: value ?? 0,
      },
    }));
  }

  function handleMaxHPClick() {
    if (!hitDie) return;
    const maxHP =
      +hitDie.split("d")[1] +
      parseInt(character.abilities.modifiers.constitution as string);
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      hp: {
        dice: hitDie as DiceTypes,
        points: maxHP,
        max:
          +hitDie.split("d")[1] +
          parseInt(character.abilities.modifiers.constitution as string),
        desc: "",
      },
    }));
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
