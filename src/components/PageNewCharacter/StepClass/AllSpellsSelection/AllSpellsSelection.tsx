import React from "react";
import spells from "@/data/spells.json";
import { Checkbox, Divider, Input, Typography } from "antd";
import classNames from "classnames";
import { Spell } from "@/data/definitions";
import { CharacterDataContext } from "@/contexts/CharacterContext";

interface AllSpellsSelectionProps {
  hideStartingText?: boolean;
}

const AllSpellsSelection: React.FC<
  AllSpellsSelectionProps & React.ComponentPropsWithRef<"div">
> = ({ className, hideStartingText }) => {
  const { character, setCharacter } = React.useContext(CharacterDataContext);
  const [search, setSearch] = React.useState("");

  const checkboxGroupClassNames = classNames("grid", "grid-cols-1", className);

  // Use state to store filtered options
  const [filteredOptions, setFilteredOptions] = React.useState(
    spells.map((spell) => ({
      label: spell.name,
      value: spell.name,
      checked: character.spells?.some((s) => s.name === spell.name),
    })),
  );

  const [startingSpells, setStartingSpells] = React.useState<Spell[]>(
    character.spells || [],
  );

  const onChange = (checkedValues: string[]) => {
    const newStartingSpells = spells.filter((spell) =>
      checkedValues.includes(spell.name),
    );
    setStartingSpells(newStartingSpells);
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  React.useEffect(() => {
    const newOptions = spells
      .filter((spell) =>
        spell.name.toLowerCase().includes(search.toLowerCase()),
      )
      .map((spell) => ({
        label: spell.name,
        value: spell.name,
        checked: character.spells?.some((s) => s.name === spell.name),
      }));
    setFilteredOptions(newOptions);
  }, [search, character.spells]);

  React.useEffect(() => {
    if (JSON.stringify(character.spells) !== JSON.stringify(startingSpells)) {
      setCharacter({ ...character, spells: startingSpells });
    }
  }, [startingSpells, character, setCharacter]);

  return (
    <>
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
        placeholder="Search"
        allowClear
        value={search}
        onChange={onChangeSearch}
      />
      <Checkbox.Group
        className={checkboxGroupClassNames}
        options={filteredOptions}
        onChange={onChange}
      />
    </>
  );
};

export default AllSpellsSelection;
