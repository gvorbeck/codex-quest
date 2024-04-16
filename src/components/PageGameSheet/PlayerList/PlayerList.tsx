import React from "react";
import {
  CharData,
  CombatantType,
  CombatantTypes,
  GamePlayerList,
} from "@/data/definitions";
import { Card, Descriptions, Flex, Spin } from "antd";
import classNames from "classnames";
import { useGameCharacters } from "@/hooks/useGameCharacters";
import { useCharacterData } from "@/hooks/useCharacterData";
import { User } from "firebase/auth";
import PlayerButtons from "./PlayerButtons/PlayerButtons";
import { getExtraIcons } from "@/support/statSupport";

interface PlayerListProps {
  players: GamePlayerList;
  setShowThiefAbilities: (showThiefAbilities: boolean) => void;
  setShowAssassinAbilities: (showAssassinAbilities: boolean) => void;
  setShowRangerAbilities: (showRangerAbilities: boolean) => void;
  setShowScoutAbilities: (showScoutAbilities: boolean) => void;
  gameId: string;
  userIsOwner: boolean;
  addToTurnTracker: (
    data: CombatantType | CharData,
    type: CombatantTypes,
  ) => void;
  user: User | null;
}

const PlayerList: React.FC<
  PlayerListProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  players,
  setShowThiefAbilities,
  setShowAssassinAbilities,
  setShowRangerAbilities,
  setShowScoutAbilities,
  gameId,
  userIsOwner,
  addToTurnTracker,
  user,
}) => {
  const [
    characterList,
    removePlayer,
    generateAbilityItems,
    generateDetailItems,
    calculateClassAbilitiesToShow,
  ] = useGameCharacters(players);
  const { setCharacter } = useCharacterData(user);
  const playerListClassNames = classNames(className);

  React.useEffect(() => {
    const { showThief, showAssassin, showRanger, showScout } =
      calculateClassAbilitiesToShow(characterList);
    setShowThiefAbilities(showThief);
    setShowAssassinAbilities(showAssassin);
    setShowRangerAbilities(showRanger);
    setShowScoutAbilities(showScout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterList]);

  return characterList.length ? (
    <Flex vertical gap={16} className={playerListClassNames}>
      {characterList
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((character) => {
          const { abilities, name, userId, charId } = character;
          const items = generateAbilityItems(abilities.scores);
          const subItems = generateDetailItems(character, setCharacter);
          const extra = getExtraIcons(character);
          return (
            <Card size="small" title={name} key={name} extra={extra}>
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
                  user={user}
                  gameId={gameId}
                  userId={userId}
                  charId={charId}
                  character={character}
                  userIsOwner={userIsOwner}
                  removePlayer={removePlayer}
                  addToTurnTracker={addToTurnTracker}
                />
              </Flex>
            </Card>
          );
        })}
    </Flex>
  ) : (
    <Spin size="large" className="w-full" />
  );
};

export default PlayerList;
