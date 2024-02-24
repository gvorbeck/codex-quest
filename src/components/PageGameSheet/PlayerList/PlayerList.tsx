import React from "react";
import { GamePlayerList } from "@/data/definitions";
import { Button, Card, Descriptions, Flex, Spin, Tooltip } from "antd";
import { openInNewTab } from "@/support/characterSupport";
import classNames from "classnames";
import { SolutionOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { useGameCharacters } from "@/hooks/useGameCharacters";

interface PlayerListProps {
  players: GamePlayerList;
  setShowThiefAbilities: (showThiefAbilities: boolean) => void;
  setShowAssassinAbilities: (showAssassinAbilities: boolean) => void;
  setShowRangerAbilities: (showRangerAbilities: boolean) => void;
  setShowScoutAbilities: (showScoutAbilities: boolean) => void;
  gameId: string;
  userIsOwner: boolean;
  setCombatants: (combatants: any[]) => void;
  addToTurnTracker: (data: any, type: "player" | "monster") => void;
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
}) => {
  const [
    characterList,
    removePlayer,
    generateAbilityItems,
    generateDetailItems,
    calculateClassAbilitiesToShow,
  ] = useGameCharacters(players);
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

  const onRemoveButtonClick = (userId?: string, characterId?: string) => {
    userId && characterId && removePlayer(gameId, userId, characterId);
  };

  return characterList.length ? (
    <Flex vertical gap={16} className={playerListClassNames}>
      {characterList
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((character) => {
          const { abilities, name, userId, charId } = character;
          const items = generateAbilityItems(abilities.scores);
          const subItems = generateDetailItems(character);
          return (
            <Card size="small" title={name} key={name}>
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
                <Flex gap={16}>
                  <Tooltip title={`Open Character Sheet`}>
                    <Button
                      icon={<SolutionOutlined />}
                      onClick={() => openInNewTab(`/u/${userId}/c/${charId}`)}
                    />
                  </Tooltip>
                  <Tooltip title={`Remove Character`}>
                    <Button
                      onClick={() => onRemoveButtonClick(userId, charId)}
                      icon={<UserDeleteOutlined />}
                      disabled={!userIsOwner}
                    />
                  </Tooltip>
                  <Tooltip title="Add to Turn Tracker">
                    <Button
                      onClick={() => addToTurnTracker(character, "player")}
                    />
                  </Tooltip>
                </Flex>
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
