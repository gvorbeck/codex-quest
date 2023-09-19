import { Button, Table } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { AbilityRecord, CharAbilityScoreStepProps } from "./definitions";
import AbilityRoller from "./AbilityRoller/AbilityRoller";

const getModifier = (score: number): string => {
  const modifierMapping: Record<number, string> = {
    3: "-3",
    5: "-2",
    8: "-1",
    12: "+0",
    15: "+1",
    17: "+2",
    18: "+3",
  };

  for (const key in modifierMapping) {
    if (score <= Number(key)) {
      return modifierMapping[Number(key)];
    }
  }
  return "+0"; // Default value
};

export default function CharacterAbilities({
  characterData,
  setCharacterData,
  setComboClass,
  setCheckedClasses,
}: CharAbilityScoreStepProps) {
  const roller = new DiceRoller();
  const rollDice = () => roller.roll("3d6").total;

  const updateCharacterData = (
    scores: Record<string, number>,
    modifiers: Record<string, string>
  ) => {
    setCharacterData({
      ...characterData,
      abilities: {
        scores: { ...characterData.abilities.scores, ...scores },
        modifiers: { ...characterData.abilities.modifiers, ...modifiers },
      },
      class: [],
      race: "",
      hp: {
        dice: "",
        points: 0,
        max: 0,
        desc: "",
      },
      equipment: [],
    });
    setComboClass(false);
    setCheckedClasses([]);
  };

  const rollAllAbilities = () => {
    const abilities = [
      "strength",
      "intelligence",
      "wisdom",
      "dexterity",
      "constitution",
      "charisma",
    ];
    const newScores: Record<string, number> = {};
    const newModifiers: Record<string, string> = {};

    abilities.forEach((ability) => {
      const score = rollDice();
      newScores[ability] = score;
      newModifiers[ability] = getModifier(score);
    });

    updateCharacterData(newScores, newModifiers);
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
        const abilityKey = record.ability.toLowerCase();
        let abilityValue = 0;
        if (isAbilityKey(abilityKey)) {
          abilityValue =
            +characterData.abilities.scores[
              abilityKey as keyof typeof characterData.abilities.scores
            ];
        }

        return (
          <AbilityRoller
            rollDice={rollDice}
            abilityValue={abilityValue}
            getModifier={getModifier}
            updateCharacterData={updateCharacterData}
            record={record}
          />
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
    <>
      <Button type="primary" onClick={rollAllAbilities} className="mb-4">
        Roll All Abilities
      </Button>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        onHeaderRow={(columns, index) => {
          return {
            className: "[&>th]:bg-slate-200 [&>th:before]:bg-slate-400",
          };
        }}
      />
    </>
  );
}
