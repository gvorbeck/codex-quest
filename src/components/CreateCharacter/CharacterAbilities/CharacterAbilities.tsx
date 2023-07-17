import React from "react";
import { Button, InputNumber, Space, Table } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { AbilityRecord, CharAbilityScoreStepProps } from "./definitions";

export default function CharacterAbilities({
  characterData,
  setCharacterData,
  setComboClass,
  setCheckedClasses,
}: CharAbilityScoreStepProps) {
  const roller = new DiceRoller();

  const rollAbilityScore = (ability: string) => {
    const result = roller.roll("3d6");
    if (!(result instanceof Array)) updateAbilityScore(result.total, ability);
  };

  const updateAbilityScore = (score: number, ability: string) => {
    let modifier;

    if (score < 3) score = 3;
    if (score > 18) score = 18;

    if (score === 3) modifier = "-3";
    else if (score <= 5) modifier = "-2";
    else if (score <= 8) modifier = "-1";
    else if (score <= 12) modifier = "+0";
    else if (score <= 15) modifier = "+1";
    else if (score <= 17) modifier = "+2";
    else if (score === 18) modifier = "+3";

    setCharacterData({
      ...characterData,
      abilities: {
        scores: { ...characterData.abilities.scores, [ability]: score },
        modifiers: {
          ...characterData.abilities.modifiers,
          [ability]: modifier,
        },
      },
      class: "",
      race: "",
      hp: {
        dice: "",
        points: 0,
        max: 0,
        desc: "",
      },
      equipment: [],
    });
    // Going back and changing ability score wipes out choices made before.
    setComboClass(false);
    setCheckedClasses([]);
  };

  const isAbilityKey = (
    key: string
  ): key is keyof typeof characterData.abilities.scores => {
    return key in characterData.abilities.scores;
  };

  const dataSource = [
    {
      key: "1",
      label: "STR",
      ability: "Strength",
      score: Number(characterData.abilities.scores.strength),
      modifier: String(characterData.abilities.modifiers.strength),
    },
    {
      key: "2",
      label: "INT",
      ability: "Intelligence",
      score: Number(characterData.abilities.scores.intelligence),
      modifier: String(characterData.abilities.modifiers.intelligence),
    },
    {
      key: "3",
      label: "WIS",
      ability: "Wisdom",
      score: Number(characterData.abilities.scores.wisdom),
      modifier: String(characterData.abilities.modifiers.wisdom),
    },
    {
      key: "4",
      label: "DEX",
      ability: "Dexterity",
      score: Number(characterData.abilities.scores.dexterity),
      modifier: String(characterData.abilities.modifiers.dexterity),
    },
    {
      key: "5",
      label: "CON",
      ability: "Constitution",
      score: Number(characterData.abilities.scores.constitution),
      modifier: String(characterData.abilities.modifiers.constitution),
    },
    {
      key: "6",
      label: "CHA",
      ability: "Charisma",
      score: Number(characterData.abilities.scores.charisma),
      modifier: String(characterData.abilities.modifiers.charisma),
    },
  ];

  const columns = [
    {
      title: "Ability",
      dataIndex: "label",
      key: "ability",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (text: string, record: AbilityRecord, index: number) => {
        const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
          event.target.select();
        };
        const abilityKey = record.ability.toLowerCase();
        let abilityValue = 0;
        if (isAbilityKey(abilityKey)) {
          abilityValue =
            +characterData.abilities.scores[
              abilityKey as keyof typeof characterData.abilities.scores
            ];
        }

        const onChange = (value: number | null) => {
          if (value === null) return;
          if (value < 3) value = 3;
          if (value > 18) value = 18;
          updateAbilityScore(value, record.ability.toLowerCase());
        };

        return (
          <Space.Compact>
            <InputNumber
              id={record.ability.toLowerCase()}
              max={18}
              min={3}
              defaultValue={0}
              onChange={onChange}
              onFocus={handleFocus}
              type="number"
              value={abilityValue}
              className="w-[40px]"
            />
            <Button
              type="primary"
              onClick={() => rollAbilityScore(record.ability.toLowerCase())}
            >
              Roll 3d6
            </Button>
          </Space.Compact>
        );
      },
    },
    {
      title: "Modifier",
      dataIndex: "modifier",
      key: "modifier",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      size="small"
    />
  );
}
