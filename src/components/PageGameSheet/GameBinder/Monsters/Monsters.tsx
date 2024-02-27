import { Alert, Collapse, CollapseProps, Flex, Input } from "antd";
import monsters from "@/data/monsters.json";
import React from "react";
import MonsterInfo from "./MonsterInfo/MonsterInfo";
import { CombatantType, CombatantTypes, Monster } from "@/data/definitions";
import { UserAddOutlined } from "@ant-design/icons";

interface MonstersProps {
  addToTurnTracker: (data: CombatantType, type: CombatantTypes) => void;
}

const Monsters: React.FC<
  MonstersProps & React.ComponentPropsWithRef<"div">
> = ({ className, addToTurnTracker }) => {
  const [monsterQuery, setMonsterQuery] = React.useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonsterQuery(event.target.value);
  };

  const genExtra = (monster: Monster) => (
    <UserAddOutlined
      onClick={(e) => {
        e.stopPropagation();
        addToTurnTracker(
          { name: monster.name, initiative: 0, type: "monster", tags: [] },
          "monster",
        );
      }}
    />
  );

  console.info(
    "monsters skipped: Assassin Vine, Aurochs, Bison, Black Pudding",
  );

  const filteredMonsters = (monsters as Monster[]).filter((monster: Monster) =>
    monster.name.toLowerCase().includes(monsterQuery.toLowerCase()),
  );

  const items: CollapseProps["items"] = filteredMonsters.map(
    (monster: Monster) => ({
      key: monster.name,
      label: monster.name,
      children: <MonsterInfo monster={monster} />,
      extra: genExtra(monster),
    }),
  );
  return (
    <Flex vertical gap={16} className={className}>
      <Alert message="Incomplete. I'm adding a few at a time. It'll get done. -admin" />
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
