import { Alert, Flex, Table, Tabs, TabsProps } from "antd";
import React from "react";
import SpellList from "./SpellList/SpellList";
import { ClassNames, GameData } from "@/data/definitions";
import { classes } from "@/data/classes";
import { toSlugCase } from "@/support/stringSupport";
import { ColumnType } from "antd/es/table";
import Notes from "./Notes/Notes";
import Monsters from "./Monsters/Monsters";
import { GameDataContext } from "@/store/GameDataContext";
import { useGameCharacters } from "@/hooks/useGameCharacters";

interface GameBinderProps {
  game: GameData;
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

const GameBinder: React.FC<GameBinderProps> = ({ game }) => {
  const { gameId, userId, addToTurnTracker } =
    React.useContext(GameDataContext);
  const { characterList, calculateClassAbilitiesToShow } = useGameCharacters(
    game.players,
  );

  if (!gameId || !userId) {
    console.error("No gameId or userId");
    return null;
  }

  const items: TabsProps["items"] = [
    {
      label: "Notes",
      key: "notes",
      children: <Notes gameId={gameId} uid={userId} notes={game.notes ?? ""} />,
    },
    {
      label: "Spells",
      key: "spells",
      children: <SpellList />,
    },
    {
      label: "Monsters",
      key: "monsters",
      children: <Monsters addToTurnTracker={addToTurnTracker} />,
    },
  ];

  const { showThief, showAssassin, showRanger, showScout } =
    calculateClassAbilitiesToShow(characterList);

  const assassinData = showAssassin
    ? generateClassAbilities(ClassNames.ASSASSIN)
    : null;
  const rangerData = showRanger
    ? generateClassAbilities(ClassNames.RANGER)
    : null;
  const scoutData = showScout ? generateClassAbilities(ClassNames.SCOUT) : null;
  const thiefData = showThief ? generateClassAbilities(ClassNames.THIEF) : null;

  const gameBinderItems: TabsProps["items"] = [
    ...items,
    ...(showAssassin
      ? getAbilitiesTable(ClassNames.ASSASSIN, assassinData!) || []
      : []),
    ...(showRanger
      ? getAbilitiesTable(ClassNames.RANGER, rangerData!) || []
      : []),
    ...(showScout ? getAbilitiesTable(ClassNames.SCOUT, scoutData!) || [] : []),
    ...(showThief ? getAbilitiesTable(ClassNames.THIEF, thiefData!) || [] : []),
  ];

  return <Tabs items={gameBinderItems} size="small" destroyInactiveTabPane />;
};

export default GameBinder;
