import { Card, Flex, Select, SelectProps, Typography } from "antd";
import React from "react";
import SpellCard from "../SpellCard/SpellCard";
import { getSpellFromName, getSpellsAtLevel } from "@/support/spellSupport";
import { CharData, ClassNames, Spell } from "@/data/definitions";
import Markdown from "react-markdown";
import { classes } from "@/data/classes";

interface SpellSelectProps {
  // setStartingSpells: (spells: Spell[]) => void;
  // magicCharacterClass: string | undefined;
  // startingSpells: Spell[];
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
  // classArr: string[];
}

const SpellSelect: React.FC<
  SpellSelectProps & React.ComponentPropsWithRef<"div">
> = ({
  character,
  setCharacter,
  // classArr,
  className,
  // character,
  // startingSpells,
  // setStartingSpells,
  // magicCharacterClass,
}) => {
  const classDescription = `Characters with the **${character.class.find((className) => classes[className as ClassNames]?.spellBudget?.length)}** class start with **Read Magic** and one other spell:`;
  const levelOneSpells = getSpellsAtLevel(character);
  const spellSelectOptions: SelectProps["options"] = levelOneSpells
    .map((spell: Spell) => ({ value: spell.name, label: spell.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  function handleStartingSpellChange(value: string) {
    const readMagicSpell = getSpellFromName("Read Magic");
    const selectedSpell = getSpellFromName(value);
    const spells = [readMagicSpell, selectedSpell].filter(Boolean) as Spell[];
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      spells,
    }));
  }
  return (
    <Card
      title={<span className="enchant-title">Choose a spell</span>}
      className={className}
    >
      <Flex vertical gap={16}>
        <Typography.Text className="[&_p]:m-0">
          <Markdown>{classDescription}</Markdown>
        </Typography.Text>
        <Select
          options={spellSelectOptions}
          // value={startingSpells?.[0]?.name}
          onChange={handleStartingSpellChange}
        />
        {/* {!!startingSpells?.length && (
          <SpellCard startingSpells={startingSpells} />
        )} */}
      </Flex>
    </Card>
  );
};

export default SpellSelect;
