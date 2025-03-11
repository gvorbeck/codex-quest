import React from "react";
import { GamePlayerList, RaceNames } from "@/data/definitions";
import { Card, Descriptions, DescriptionsProps, Flex, Spin } from "antd";
import { useGameCharacters } from "@/hooks/useGameCharacters";
import { useCharacterData } from "@/hooks/useCharacterData";
import PlayerButtons from "./PlayerButtons/PlayerButtons";
import {
  getAttackBonus,
  getExtraIcons,
  getRaceRangedAttackBonus,
} from "@/support/statSupport";
import { GameDataContext } from "@/store/GameDataContext";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useTheme } from "@/components/ThemeSwitcher/ThemeSwitcher";
import { races } from "@/data/races";

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
  const { isDarkMode } = useTheme();

  return characterList.length && gameId ? (
    <Flex vertical gap={16} className={className}>
      {characterList
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((character) => {
          const { abilities, name, userId, charId } = character;
          const abilityItems = generateAbilityItems(abilities.modifiers);
          const subItems = generateDetailItems(character, characterDispatch);
          const attackBonus = getAttackBonus(character);
          const rangedRaceBonus = getRaceRangedAttackBonus(character);
          const attackItems: DescriptionsProps["items"] = [
            {
              key: "base",
              label: "Base",
              children: attackBonus,
              span: 1,
            },
            {
              key: "melee",
              label: "Melee",
              children: attackBonus + +abilities.modifiers.strength,
              span: 1,
            },
            {
              key: "ranged",
              label: "Ranged",
              children:
                attackBonus +
                +character.abilities.modifiers.dexterity +
                (rangedRaceBonus ?? 0),
            },
          ];
          const extra = getExtraIcons(character, isDarkMode);
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
                  items={abilityItems}
                  bordered
                  size="small"
                  className="[&_*]:text-xs"
                />
                <Descriptions
                  column={3}
                  items={attackItems}
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
