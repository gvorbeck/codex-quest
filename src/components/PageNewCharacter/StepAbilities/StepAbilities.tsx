import { Abilities, CharData } from "@/data/definitions";
import { Button, Descriptions, Flex, Table, TableProps } from "antd";
import AbilityRoller from "./AbilityRoller/AbilityRoller";
import { useDeviceType } from "@/hooks/useDeviceType";
import { calculateModifier, rollDice } from "@/support/diceSupport";

interface StepAbilitiesProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
  newCharacter?: boolean;
}

const StepAbilities: React.FC<
  StepAbilitiesProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter, newCharacter }) => {
  const { isMobile } = useDeviceType();
  const dataSource: TableProps["dataSource"] = [
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

  const columns: TableProps["columns"] = [
    {
      title: "Ability",
      dataIndex: "label",
    },
    {
      title: "Score",
      dataIndex: "score",
      render: (
        _,
        record: {
          key: string;
          label: string;
          ability: string;
          score: number;
          modifier: string;
        },
      ) => {
        const abilityKey = record.ability.toLowerCase();

        return (
          <AbilityRoller
            character={character}
            setCharacter={setCharacter}
            ability={abilityKey as keyof Abilities}
            newCharacter={newCharacter}
          />
        );
      },
    },
    {
      title: "Modifier",
      dataIndex: "modifier",
    },
  ];

  function handleRollAllAbilities() {
    const abilityRolls = rollDice("3d6", 6);
    const newScores = { ...character.abilities.scores };
    const newModifiers = { ...character.abilities.modifiers };

    Object.keys(newScores).forEach((ability, index) => {
      const score = abilityRolls[index];
      newScores[ability as keyof Abilities] = score;
      newModifiers[ability as keyof Abilities] = calculateModifier(score) + "";
    });

    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      abilities: {
        scores: newScores,
        modifiers: newModifiers,
      },
      race: newCharacter ? "" : prevCharacter.race,
      class: newCharacter ? [] : [...prevCharacter.class],
      hp: newCharacter
        ? { dice: "", points: 0, max: 0, desc: "" }
        : { ...prevCharacter.hp },
    }));
  }

  function handleFlipAbilities() {
    setCharacter((prevCharacter) => {
      const flippedScores = Object.fromEntries(
        Object.entries(prevCharacter.abilities.scores).map(([key, value]) => [
          key,
          21 - +value,
        ]),
      );
      const flippedModifiers = Object.fromEntries(
        Object.entries(flippedScores).map(([key, value]) => [
          key,
          calculateModifier(value),
        ]),
      );

      return {
        ...prevCharacter,
        abilities: {
          scores: flippedScores as Abilities,
          modifiers: flippedModifiers as Abilities,
        },
        race: newCharacter ? "" : prevCharacter.race,
        class: newCharacter ? [] : [...prevCharacter.class],
        hp: newCharacter
          ? { dice: "", points: 0, max: 0, desc: "" }
          : { ...prevCharacter.hp },
      };
    });
  }

  function areAllAbilitiesSet() {
    const abilities = character.abilities.scores;
    for (const key in abilities) {
      const value = +abilities[key as keyof typeof abilities];
      if (value <= 0 || isNaN(value)) {
        return false;
      }
    }
    if (Object.entries(abilities).length === 6) return true;
  }

  function getAbilityTotalItems() {
    const { modifiers } = character.abilities;
    const total = Object.values(modifiers).reduce((acc, score) => {
      return +acc + +score;
    });
    return [
      {
        key: "1",
        label: "Modifier Total",
        children: <span>{+total >= 0 ? `+${total}` : total}</span>,
      },
    ];
  }

  return (
    <>
      {newCharacter && (
        <Flex gap={16} align="center" justify="flex-start">
          <Button type="primary" onClick={handleRollAllAbilities}>
            Roll All Abilities
          </Button>
          <Button
            disabled={!areAllAbilitiesSet()}
            onClick={handleFlipAbilities}
          >
            Flip 'em
          </Button>
          {areAllAbilitiesSet() && (
            <Descriptions
              className="[&_td]:p-0 inline-block"
              items={getAbilityTotalItems()}
            />
          )}
        </Flex>
      )}
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size={isMobile ? "small" : "large"}
        bordered
        className={`${className ?? ""} w-fit`}
      />
    </>
  );
};

export default StepAbilities;
