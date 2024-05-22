import React from "react";
import { GamePlayerList } from "@/data/definitions";
import { Card, Descriptions, Flex, Spin } from "antd";
import { useGameCharacters } from "@/hooks/useGameCharacters";
import { useCharacterData } from "@/hooks/useCharacterData";
import PlayerButtons from "./PlayerButtons/PlayerButtons";
import { getExtraIcons } from "@/support/statSupport";
import { GameDataContext } from "@/store/GameDataContext";
import { useDeviceType } from "@/hooks/useDeviceType";

interface PlayerListProps {
  players: GamePlayerList;
}

const PlayerList: React.FC<
  PlayerListProps & React.ComponentPropsWithRef<"div">
> = ({ className, players }) => {
  const {
    characterList,
    removePlayer,
    generateAbilityItems,
    generateDetailItems,
  } = useGameCharacters(players);
  const { user, gameId } = React.useContext(GameDataContext);
  const { characterDispatch } = useCharacterData(user);
  const { isMobile } = useDeviceType();

  return characterList.length && gameId ? (
    <Flex vertical gap={16} className={className}>
      {characterList
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((character) => {
          const { abilities, name, userId, charId } = character;
          const items = generateAbilityItems(abilities.scores);
          const subItems = generateDetailItems(character, characterDispatch);
          const extra = getExtraIcons(character);
          return (
            <Card
              size="small"
              title={name}
              key={name}
              extra={extra}
              className={
                isMobile
                  ? "[&_.ant-card-head-wrapper]:flex [&_.ant-card-head-wrapper]:flex-col [&_.ant-card-head-wrapper]:items-start [&_.ant-card-head-wrapper]:overflow-scroll"
                  : ""
              }
              styles={{
                title: {
                  marginTop: isMobile ? "0.5rem" : 0,
                },
                extra: {
                  margin: isMobile ? 0 : "auto",
                },
              }}
            >
              <Flex vertical gap={16}>
                <Descriptions
                  column={3}
                  items={items}
                  bordered
                  size="small"
                  className="[&_*]:text-xs"
                />
                <Descriptions
                  className="[&_*]:text-xs"
                  column={2}
                  items={subItems}
                  size="small"
                />
                <PlayerButtons
                  userId={userId}
                  charId={charId}
                  character={character}
                  removePlayer={removePlayer}
                />
              </Flex>
            </Card>
          );
        })}
    </Flex>
  ) : (
    <Spin size="large" className="w-full h-full py-4" />
  );
};

export default PlayerList;
