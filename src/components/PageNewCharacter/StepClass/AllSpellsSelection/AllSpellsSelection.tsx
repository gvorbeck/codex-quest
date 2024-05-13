import { CharData, Spell } from "@/data/definitions";
import spells from "@/data/spells.json";
import { getSpellFromName } from "@/support/spellSupport";
import { Checkbox, Divider, Flex, Input, Typography } from "antd";
import React from "react";

interface AllSpellsSelectionProps {
  hideStartingText?: boolean;
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
}

const AllSpellsSelection: React.FC<
  AllSpellsSelectionProps & React.ComponentPropsWithRef<"div">
> = ({ className, hideStartingText, character, setCharacter }) => {
  const [search, setSearch] = React.useState("");

  const spellOptions = spells.map((spell) => ({
    label: spell.name,
    value: spell.name,
    checked: character.spells?.some((s) => s.name === spell.name),
  }));

  let filteredSpells;
  search.length
    ? (filteredSpells = spellOptions.filter((spell) =>
        spell.label.toLowerCase().includes(search.toLowerCase()),
      ))
    : (filteredSpells = spellOptions);

  function handleChangeSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }
  function handleCheckboxChange(checkedValues: string[]) {
    const selectedSpells = checkedValues.map((spell) =>
      getSpellFromName(spell),
    );
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      spells: selectedSpells as Spell[],
    }));
  }

  return (
    <Flex gap={8} className={className} vertical>
      {!hideStartingText && (
        <>
          <Divider plain className="font-enchant text-2xl">
            Starting Spells
          </Divider>
          <Typography.Text>
            Choose the spells your custom class starts level 1 with, if any.
          </Typography.Text>
        </>
      )}
      <Input
        placeholder="Search spells"
        allowClear
        value={search}
        onChange={handleChangeSearch}
      />
      <Checkbox.Group
        className="grid grid-cols-1"
        options={filteredSpells}
        defaultValue={character.spells?.map((s) => s.name)}
        onChange={handleCheckboxChange}
      />
    </Flex>
  );
};

export default AllSpellsSelection;
