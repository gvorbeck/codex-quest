import { Spell } from "@/data/definitions";
import { getSpellFromName } from "@/support/spellSupport";
import { Checkbox, Flex, Typography } from "antd";
import React, { useState } from "react";

interface SpellOptionsListProps {
  spellLevel: number;
  spellsAtLevel: Spell[];
  selectedSpells: Spell[][];
  setSelectedSpells: (selectedSpells: Spell[][]) => void;
  max: number;
}

const SpellOptionsList: React.FC<
  SpellOptionsListProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  spellLevel,
  spellsAtLevel,
  selectedSpells,
  setSelectedSpells,
  max,
}) => {
  const index = spellLevel - 1;
  const [checkedValues, setCheckedValues] = useState<string[]>(
    selectedSpells.length && selectedSpells[index]
      ? selectedSpells[index].map((spell) => spell.name)
      : [],
  );

  const handleCheckboxChange = (checkedList: Array<string>) => {
    setCheckedValues(checkedList.map((value) => String(value)));
  };

  React.useEffect(() => {
    const newSelectedSpells = [...selectedSpells];
    if (!checkedValues.length) {
      newSelectedSpells[index] = [];
    } else {
      const newCheckedSpells = checkedValues.reduce((acc, spellName) => {
        const spell = getSpellFromName(spellName);
        if (spell) {
          acc.push(spell);
        }
        return acc;
      }, [] as Spell[]);
      newSelectedSpells[index] = newCheckedSpells;
    }
    setSelectedSpells(newSelectedSpells);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedValues]);

  return (
    <Flex className={className} vertical>
      <Typography.Title level={5}>Level {spellLevel} Spells</Typography.Title>
      <Checkbox.Group
        options={spellsAtLevel.map((spell) => ({
          label: spell.name,
          value: spell.name,
          disabled:
            checkedValues.length >= max && !checkedValues.includes(spell.name),
        }))}
        value={checkedValues}
        onChange={handleCheckboxChange}
        className="flex flex-col border border-stone border-solid rounded-md p-2"
      />
    </Flex>
  );
};

export default SpellOptionsList;
