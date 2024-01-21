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
                <Flex justify="space-between">
                  <Button
                    type="primary"
                    icon={<SolutionOutlined />}
                    onClick={() => openInNewTab(`/u/${userId}/c/${charId}`)}
                  >
                    Character Sheet
                  </Button>
                  <Tooltip title={`Remove ${name}`}>
                    <Button
                      onClick={() => onRemoveButtonClick(userId, charId)}
                      icon={<UserDeleteOutlined />}
                      disabled={!userIsOwner}
                    >
                      Remove
                    </Button>
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
