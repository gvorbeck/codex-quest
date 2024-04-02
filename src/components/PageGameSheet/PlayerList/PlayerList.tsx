import React from "react";
import {
  CharData,
  CombatantType,
  CombatantTypes,
  GamePlayerList,
} from "@/data/definitions";
import {
  Button,
  Card,
  Descriptions,
  Flex,
  Popconfirm,
  Spin,
  Tooltip,
} from "antd";
import { openInNewTab } from "@/support/characterSupport";
import classNames from "classnames";
import { SolutionOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { useGameCharacters } from "@/hooks/useGameCharacters";
import { useCharacterData } from "@/hooks/useCharacterData";
import { User } from "firebase/auth";
import { TrackerAddSvg } from "@/support/svgSupport";
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";

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

const TrackerAddIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={TrackerAddSvg} {...props} />
);

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

  const onRemoveButtonClick = (userId?: string, characterId?: string) => {
    userId && characterId && removePlayer(gameId, userId, characterId);
  };

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
                  <Popconfirm
                    title="Remove this character?"
                    onConfirm={() =>
                      user && onRemoveButtonClick(user.uid, charId)
                    }
                    okText="Yes"
                    cancelText="No"
                    disabled={!userIsOwner}
                  >
                    <Tooltip title={`Remove Character`} placement="bottom">
                      <Button icon={<UserDeleteOutlined />} />
                    </Tooltip>
                  </Popconfirm>
                  <Tooltip title="Add to Round Tracker">
                    <Button
                      onClick={() => addToTurnTracker(character, "player")}
                      className="[&:hover_svg]:fill-seaBuckthorn"
                      icon={<TrackerAddIcon />}
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
