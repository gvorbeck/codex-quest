import { Collapse, CollapseProps, Flex, Input } from "antd";
import monsters from "@/data/monsters.json";
import React from "react";
import MonsterDescription from "./MonsterDescription/MonsterDescription";
import { Monster } from "@/data/definitions";

interface MonstersProps {}

const Monsters: React.FC<
  MonstersProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const [monsterQuery, setMonsterQuery] = React.useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonsterQuery(event.target.value);
  };

  const filteredMonsters = (monsters as Monster[]).filter((monster: Monster) =>
    monster.name.toLowerCase().includes(monsterQuery.toLowerCase()),
  );

  const items: CollapseProps["items"] = filteredMonsters.map(
    (monster: Monster) => ({
      key: monster.name,
      label: monster.name,
      children: <MonsterDescription monster={monster} />,
    }),
  );
  return (
    <Flex vertical gap={16} className={className}>
      <Input
        value={monsterQuery}
        onChange={handleInputChange}
        placeholder="Search Monsters"
      />
      <Collapse items={items} destroyInactivePanel />
    </Flex>
  );
};

export default Monsters;
