import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { CharacterHitPointsProps } from "./definitions";
import { classChoices } from "../../../data/classDetails";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";
import { ClassNames } from "../../definitions";

export default function CharacterHitPoints({
  characterData,
  setCharacterData,
  comboClass,
}: CharacterHitPointsProps) {
  const [customHitDice, setCustomHitDice] = useState("");

  const roller = new DiceRoller();

  useEffect(() => {
    let dice: string;

    if (comboClass) {
      if (characterData.class.includes(ClassNames.THIEF)) {
        dice = "d4";
      } else {
        dice = "d6";
      }
    } else {
      if (characterData.class === ClassNames.CLERIC) {
        dice = "d6";
      } else if (characterData.class === ClassNames.FIGHTER) {
        dice = "d8";
        if (characterData.race === "Elf" || characterData.race === "Halfling") {
          dice = "d6";
        }
      } else if (characterData.class === ClassNames.MAGICUSER) {
        dice = "d4";
      } else if (
        characterData.class === ClassNames.THIEF ||
        characterData.class === ClassNames.ASSASSIN
      ) {
        dice = "d4";
      } else if (characterData.class === ClassNames.BARBARIAN) {
        dice = "d10";
      } else dice = characterData.hp.dice;
    }

    setCharacterData({
      ...characterData,
      hp: {
        ...characterData.hp,
        dice,
      },
    });
  }, []);

  const onClick = () => {
    const result = roller.roll(characterData.hp.dice);
    if (!(result instanceof Array)) handleHitPointValue(result.total);
  };

  const handleHitPointValue = (value: number | null) => {
    if (value === null) return;
    value += +characterData.abilities.modifiers.constitution;
    if (value < 1) value = 1;
    setCharacterData({
      ...characterData,
      hp: { ...characterData.hp, points: value, max: value },
    });
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleChangeCustomHitDice = (event: RadioChangeEvent) => {
    setCustomHitDice(event.target.value);
    setCharacterData({
      ...characterData,
      hp: {
        ...characterData.hp,
        dice: event.target.value,
      },
    });
  };

  return (
    <>
      {!classChoices.includes(
        ClassNames[characterData.class as keyof typeof ClassNames]
      ) && (
        <>
          <Radio.Group
            value={customHitDice}
            onChange={handleChangeCustomHitDice}
            buttonStyle="solid"
            className="block mb-4"
          >
            <Radio.Button value="d4">d4</Radio.Button>
            <Radio.Button value="d6">d6</Radio.Button>
            <Radio.Button value="d8">d8</Radio.Button>
            <Radio.Button value="d10">d10</Radio.Button>
            <Radio.Button value="d12">d12</Radio.Button>
            <Radio.Button value="d20">d20</Radio.Button>
          </Radio.Group>
          <HomebrewWarning homebrew="Race or Class" />
          <Divider />
        </>
      )}
      <Space.Compact>
        <InputNumber
          max={11}
          min={1}
          defaultValue={0}
          onChange={handleHitPointValue}
          onFocus={handleFocus}
          type="number"
          value={characterData.hp.points}
        />
        <Button
          type="primary"
          onClick={onClick}
          disabled={
            customHitDice === "" &&
            !classChoices.includes(
              ClassNames[characterData.class as keyof typeof ClassNames]
            )
          }
        >{`Roll 1${characterData.hp.dice}${characterData.abilities.modifiers.constitution}`}</Button>
      </Space.Compact>
    </>
  );
}
