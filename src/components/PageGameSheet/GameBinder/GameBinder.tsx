import { Alert, Flex, Table, Tabs, TabsProps } from "antd";
import React from "react";
import SpellList from "./SpellList/SpellList";
import { ClassNames, GamePlayer } from "@/data/definitions";
import { classes } from "@/data/classes";
import { toSlugCase } from "@/support/stringSupport";
import { ColumnType } from "antd/es/table";
import Notes from "./Notes/Notes";
import Monsters from "./Monsters/Monsters";

interface GameBinderProps {
  players: GamePlayer[];
  showThiefAbilities: boolean;
  showAssassinAbilities: boolean;
  showRangerAbilities: boolean;
  showScoutAbilities: boolean;
  gameId: string;
  uid: string;
  notes?: string;
}

const generateClassAbilities = (charClass: ClassNames) => {
  const titles = classes[charClass].specialAbilities?.titles || [];
  const stats = classes[charClass].specialAbilities?.stats.slice(1) || []; // Skip the first "level 0" entry

  const columns: ColumnType<{ [key: string]: number }>[] = [
    { title: "Level", dataIndex: "level", key: "level", fixed: "left" },
    ...titles.map((title) => ({
      title,
      dataIndex: toSlugCase(title),
      key: toSlugCase(title),
    })),
  ];

  const dataSource = stats.map((statRow, index) => {
    const row: { [key: string]: number } = {
      key: index + 1,
      level: index + 1,
    };
    statRow.forEach((stat, statIndex) => {
      row[toSlugCase(titles[statIndex])] = stat;
    });
    return row;
  });

  return {
    columns,
    dataSource,
  };
};

const getAbilitiesTable = (
  charClass: string,
  charData: ReturnType<typeof generateClassAbilities>,
): TabsProps["items"] => [
  {
    label: `${charClass} Abilities`,
    key: `${charClass.toLowerCase()}-abilities`,
    children: (
      <Flex vertical gap={16}>
        <Alert
          type="info"
          message="These values may be adjusted by your players' race choices."
        />
        <Table
          size="small"
          bordered
          scroll={{ x: "max-content" }}
          dataSource={charData.dataSource}
          columns={charData.columns}
        />
      </Flex>
    ),
  },
];

const GameBinder: React.FC<
  GameBinderProps & React.ComponentPropsWithRef<"div">
> = ({
  notes,
  uid,
  gameId,
  className,
  showThiefAbilities,
  showAssassinAbilities,
  showRangerAbilities,
  showScoutAbilities,
}) => {
  const items: TabsProps["items"] = [
    {
      label: "Notes",
      key: "notes",
      children: <Notes gameId={gameId} uid={uid} notes={notes} />,
    },
    {
      label: "Spells",
      key: "spells",
      children: <SpellList />,
    },
    {
      label: "Monsters",
      key: "monsters",
      children: <Monsters />,
    },
  ];
  const assassinData = generateClassAbilities(ClassNames.ASSASSIN);
  const rangerData = generateClassAbilities(ClassNames.RANGER);
  const scoutData = generateClassAbilities(ClassNames.SCOUT);
  const thiefData = generateClassAbilities(ClassNames.THIEF);

  const gameBinderItems: TabsProps["items"] = [
    ...items,
    ...(showAssassinAbilities
      ? getAbilitiesTable(ClassNames.ASSASSIN, assassinData) || []
      : []),
    ...(showRangerAbilities
      ? getAbilitiesTable(ClassNames.RANGER, rangerData) || []
      : []),
    ...(showScoutAbilities
      ? getAbilitiesTable(ClassNames.SCOUT, scoutData) || []
      : []),
    ...(showThiefAbilities
      ? getAbilitiesTable(ClassNames.THIEF, thiefData) || []
      : []),
  ];

  return (
    <Tabs
      className={className}
      items={gameBinderItems}
      size="small"
      destroyInactiveTabPane
    />
  );
};

export default GameBinder;
