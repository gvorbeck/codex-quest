import { Card, Flex, Select, SelectProps, Typography } from "antd";
import React from "react";
import SpellCard from "../SpellCard/SpellCard";
import { getSpellFromName, getSpellsAtLevel } from "@/support/spellSupport";
import {
  CharData,
  CharDataAction,
  ClassNames,
  Spell,
} from "@/data/definitions";
import LightMarkdown from "@/components/LightMarkdown/LightMarkdown";
import { classes } from "@/data/classes";

interface SpellSelectProps {
  character: CharData;
  characterDispatch: React.Dispatch<CharDataAction>;
}

const SpellSelect: React.FC<
  SpellSelectProps & React.ComponentPropsWithRef<"div">
> = ({ character, characterDispatch, className }) => {
  const classDescription = `Characters with the **${character.class.find((className) => classes[className as ClassNames]?.spellBudget?.length)}** class start with **Read Magic** and one other spell:`;
  const levelOneSpells = getSpellsAtLevel(character);
  const spellSelectOptions: SelectProps["options"] = levelOneSpells
    .map((spell: Spell) => ({ value: spell.name, label: spell.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  function handleStartingSpellChange(value: string) {
    const readMagicSpell = getSpellFromName("Read Magic");
    const selectedSpell = getSpellFromName(value);
    const spells = [readMagicSpell, selectedSpell].filter(Boolean) as Spell[];
    characterDispatch({
      type: "SET_SPELLS",
      payload: {
        spells,
      },
    });
  }
  return (
    <Card
      title={<span className="enchant-title">Choose a spell</span>}
      className={className}
    >
      <Flex vertical gap={16}>
        <Typography.Text className="[&_p]:m-0">
          <LightMarkdown>{classDescription}</LightMarkdown>
        </Typography.Text>
        <Select
          options={spellSelectOptions}
          onChange={handleStartingSpellChange}
        />
        {character.spells.length > 0 && (
          <SpellCard spell={character.spells[1]} />
        )}
      </Flex>
    </Card>
  );
};

export default SpellSelect;
