import { Collapse, CollapseProps, Flex, Input } from "antd";
import React from "react";
import spells from "@/data/spells.json";
import SpellDescription from "./SpellDescription/SpellDescription";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SpellListProps {}

const SpellList: React.FC<
  SpellListProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const [spellQuery, setSpellQuery] = React.useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpellQuery(event.target.value);
  };

  const filteredSpells = spells.filter((spell) =>
    spell.name.toLowerCase().includes(spellQuery.toLowerCase()),
  );

  const items: CollapseProps["items"] = filteredSpells.map((spell) => ({
    key: spell.name,
    label: spell.name,
    children: <SpellDescription spell={spell} />,
  }));

  return (
    <Flex vertical gap={16} className={className}>
      <Input
        value={spellQuery}
        onChange={handleInputChange}
        placeholder="Search Spells"
      />
      <Collapse items={items} destroyInactivePanel />
    </Flex>
  );
};

export default SpellList;
