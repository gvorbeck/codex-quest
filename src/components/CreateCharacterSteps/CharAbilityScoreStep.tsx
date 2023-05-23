import React from "react";
import { Button, InputNumber, Space, Table } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { AbilityRecord, CharAbilityScoreStepProps } from "../types";

export default function CharAbilityScoreStep({
  abilities,
  setAbilities,
  abilityModifiers,
  setAbilityModifiers,
  setPlayerClass,
  setComboClass,
  setCheckedClasses,
  setRace,
  setHitDice,
  setHitPoints,
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

    setAbilities({ ...abilities, [ability]: score });

    if (score === 3) modifier = "-3";
    else if (score <= 5) modifier = "-2";
    else if (score <= 8) modifier = "-1";
    else if (score <= 12) modifier = "+0";
    else if (score <= 15) modifier = "+1";
    else if (score <= 17) modifier = "+2";
    else if (score === 18) modifier = "+3";

    setAbilityModifiers({ ...abilityModifiers, [ability]: modifier });
    // Going back and changing ability score wipes out choices made before.
    setPlayerClass("");
    setComboClass(false);
    setCheckedClasses([]);
    setRace("");
    setHitDice("");
    setHitPoints(0);
  };

  const isAbilityKey = (key: string): key is keyof typeof abilities => {
    return key in abilities;
  };

  const dataSource = [
    {
      key: "1",
      ability: "Strength",
      score: abilities.strength,
      modifier: abilityModifiers.strength,
    },
    {
      key: "2",
      ability: "Intelligence",
      score: abilities.intelligence,
      modifier: abilityModifiers.intelligence,
    },
    {
      key: "3",
      ability: "Wisdom",
      score: abilities.wisdom,
      modifier: abilityModifiers.wisdom,
    },
    {
      key: "4",
      ability: "Dexterity",
      score: abilities.dexterity,
      modifier: abilityModifiers.dexterity,
    },
    {
      key: "5",
      ability: "Constitution",
      score: abilities.constitution,
      modifier: abilityModifiers.constitution,
    },
    {
      key: "6",
      ability: "Charisma",
      score: abilities.charisma,
      modifier: abilityModifiers.charisma,
    },
  ];

  const columns = [
    {
      title: "Ability",
      dataIndex: "ability",
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
          abilityValue = abilities[abilityKey];
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

  return <Table columns={columns} dataSource={dataSource} pagination={false} />;
}
