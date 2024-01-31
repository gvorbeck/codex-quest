import { Button, Descriptions, DescriptionsProps, Flex, Table } from "antd";
import React from "react";
import { AbilityRecord, CharData } from "@/data/definitions";
import AbilityRoller from "./AbilityRoller/AbilityRoller";
import { rollDice } from "@/support/diceSupport";
import { getModifier, isAbilityKey } from "@/support/statSupport";
import {
  areAllAbilitiesSet,
  flipAbilityScores,
  getAbilitiesDataSource,
  getAbilityTotalItems,
  updateCharacter,
} from "@/support/pageNewCharacterSupport";

interface StepAbilitiesProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  setComboClass?: (comboClass: boolean) => void;
  setComboClassSwitch?: (comboClassSwitch: boolean) => void;
  hideRollAll?: boolean;
  newCharacter?: boolean;
}

const StepAbilities: React.FC<
  StepAbilitiesProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter, hideRollAll, newCharacter }) => {
  const dataSource = getAbilitiesDataSource(character);
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
            abilityValue={abilityValue}
            record={record}
            character={character}
            setCharacter={setCharacter}
            newCharacter
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
    updateCharacter(
      newScores,
      newModifiers,
      character,
      setCharacter,
      newCharacter,
    );
  };

  const abilityTotalItems: DescriptionsProps["items"] =
    getAbilityTotalItems(character);

  return (
    <Flex vertical className={className} gap={16}>
      {!hideRollAll && (
        <Flex gap={16} align="center" justify="flex-start">
          <Button
            type="primary"
            onClick={rollAllAbilities}
            className="self-start"
          >
            Roll All Abilities
          </Button>
          {areAllAbilitiesSet(character?.abilities?.scores) && (
            <>
              <Descriptions
                className="[&_td]:p-0 inline-block"
                items={abilityTotalItems}
              />
              <Button
                onClick={() => flipAbilityScores(character, setCharacter)}
              >
                Flip 'Em
              </Button>
            </>
          )}
        </Flex>
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
