import { Card, Flex, Select, SelectProps, Typography } from "antd";
import React from "react";
import WSpellCard from "../WSpellCard/WSpellCard";
import { getSpellFromName, getSpellsAtLevel } from "@/support/spellSupport";
import { CharData, Spell } from "@/data/definitions";
import { useMarkdown } from "@/hooks/useMarkdown";

interface WSpellSelectProps {
  setStartingSpells: (spells: Spell[]) => void;
  magicCharacterClass: string | undefined;
  startingSpells: Spell[];
  character: CharData;
  classArr: string[];
}

const WSpellSelect: React.FC<
  WSpellSelectProps & React.ComponentPropsWithRef<"div">
> = ({
  classArr,
  className,
  character,
  startingSpells,
  setStartingSpells,
  magicCharacterClass,
}) => {
  const classDescription = useMarkdown(
    `Characters with the **${magicCharacterClass}** class start with **Read Magic** and one other spell:`,
  );
  const levelOneSpells = getSpellsAtLevel(classArr, character.level);
  const spellSelectOptions: SelectProps["options"] = levelOneSpells
    .map((spell: Spell) => ({ value: spell.name, label: spell.name }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const onStartingSpellChange = (value: string) => {
    const readMagicSpell = getSpellFromName("Read Magic");
    const selectedSpell = getSpellFromName(value);
    const spells = [readMagicSpell, selectedSpell].filter(Boolean) as Spell[];
    setStartingSpells(spells);
  };
  return (
    <Card
      title={
        <span className="font-enchant text-3xl tracking-wide">
          Choose a spell
        </span>
      }
      className={className}
    >
      <Flex vertical gap={16}>
        <Typography.Text className="[&_p]:m-0">
          <div dangerouslySetInnerHTML={{ __html: classDescription }} />
        </Typography.Text>
        <Select
          options={spellSelectOptions}
          value={startingSpells?.[0]?.name}
          onChange={onStartingSpellChange}
        />
        {!!startingSpells?.length && (
          <WSpellCard startingSpells={startingSpells} />
        )}
      </Flex>
    </Card>
  );
};

export default WSpellSelect;
