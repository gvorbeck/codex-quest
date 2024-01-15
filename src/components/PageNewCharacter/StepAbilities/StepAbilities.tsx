import { Button, Flex, Table } from "antd";
import React from "react";
import { AbilityRecord, CharData } from "@/data/definitions";
import AbilityRoller from "./AbilityRoller/AbilityRoller";
import { rollDice } from "@/support/diceSupport";
import { getModifier, isAbilityKey } from "@/support/statSupport";

interface StepAbilitiesProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  setComboClass?: (comboClass: boolean) => void;
  setComboClassSwitch?: (comboClassSwitch: boolean) => void;
  hideRollAll?: boolean;
}

const StepAbilities: React.FC<
  StepAbilitiesProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  character,
  setCharacter,
  setComboClass,
  hideRollAll,
  setComboClassSwitch,
}) => {
  const dataSource = [
    {
      key: "1",
      label: "STR",
      ability: "Strength",
      score: Number(character.abilities?.scores.strength) || 0,
      modifier: character.abilities?.modifiers?.strength || "",
    },
    {
      key: "2",
      label: "INT",
      ability: "Intelligence",
      score: Number(character.abilities?.scores.intelligence) || 0,
      modifier: character.abilities?.modifiers?.intelligence || "",
    },
    {
      key: "3",
      label: "WIS",
      ability: "Wisdom",
      score: Number(character.abilities?.scores.wisdom) || 0,
      modifier: character.abilities?.modifiers?.wisdom || "",
    },
    {
      key: "4",
      label: "DEX",
      ability: "Dexterity",
      score: Number(character.abilities?.scores.dexterity) || 0,
      modifier: character.abilities?.modifiers?.dexterity || "",
    },
    {
      key: "5",
      label: "CON",
      ability: "Constitution",
      score: Number(character.abilities?.scores.constitution) || 0,
      modifier: character.abilities?.modifiers?.constitution || "",
    },
    {
      key: "6",
      label: "CHA",
      ability: "Charisma",
      score: Number(character.abilities?.scores.charisma) || 0,
      modifier: character.abilities?.modifiers?.charisma || "",
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_text: string, record: AbilityRecord, _index: number) => {
        const abilityKey = record.ability.toLowerCase();
        let abilityValue = 0;
        if (isAbilityKey(abilityKey, character)) {
          abilityValue =
            +character.abilities.scores[
              abilityKey as keyof typeof character.abilities.scores
            ];
        }

        return (
          <AbilityRoller
            rollDice={rollDice}
            abilityValue={abilityValue}
            getModifier={getModifier}
            updateCharacterData={updateCharacter}
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

  const updateCharacter = (
    scores: Record<string, number>,
    modifiers: Record<string, string>,
  ) => {
    setCharacter({
      ...character,
      abilities: {
        scores: { ...character.abilities?.scores, ...scores },
        modifiers: { ...character.abilities?.modifiers, ...modifiers },
      },
      class: character.class || [],
      race: character.race || "",
      hp: {
        dice: character.hp?.dice || "",
        points: character.hp?.points || 0,
        max: character.hp?.max || 0,
        desc: character.hp?.desc || "",
      },
      equipment: character.equipment || [],
    });
    setComboClass && setComboClass(false);
    setComboClassSwitch && setComboClassSwitch(false);
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
      const score = rollDice("3d6");
      newScores[ability] = score;
      newModifiers[ability] = getModifier(score);
    });

    updateCharacter(newScores, newModifiers);
  };

  return (
    <Flex vertical className={className} gap={16}>
      {!hideRollAll && (
        <Button type="primary" onClick={rollAllAbilities}>
          Roll All Abilities
        </Button>
      )}
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
        bordered
      />
    </Flex>
  );
};

export default StepAbilities;
