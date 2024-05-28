import CqDivider from "@/components/CqDivider/CqDivider";
import { CharData, Spell } from "@/data/definitions";
import spells from "@/data/spells.json";
import { getSpellFromName } from "@/support/spellSupport";
import { Checkbox, Flex, Input, Typography } from "antd";
import React from "react";

interface AllSpellsSelectionProps {
  hideStartingText?: boolean;
  character: CharData;
  characterDispatch: React.Dispatch<any>;
}

const AllSpellsSelection: React.FC<
  AllSpellsSelectionProps & React.ComponentPropsWithRef<"div">
> = ({ className, hideStartingText, character, characterDispatch }) => {
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
    characterDispatch({
      type: "SET_SPELLS",
      payload: {
        spells: selectedSpells as Spell[],
      },
    });
  }

  return (
    <Flex gap={8} className={className} vertical>
      {!hideStartingText && (
        <>
          <CqDivider>Starting Spells</CqDivider>
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
