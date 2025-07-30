import TrackerAddSvg from "@/assets/svg/TrackerAddSvg";
import { CharData } from "@/data/definitions";
import { GameDataContext } from "@/store/GameDataContext";
import { openInNewTab } from "@/support/characterSupport";
import { SolutionOutlined, UserDeleteOutlined } from "@ant-design/icons";
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";
import { Button, Flex, Popconfirm, Tooltip } from "antd";
import React from "react";

interface PlayerButtonsProps {
  removePlayer: (
    gameId: string,
    userId: string,
    characterId: string,
  ) => Promise<void>;
  userId: string | undefined;
  charId: string | undefined;
  character: CharData;
}

const PlayerButtons: React.FC<PlayerButtonsProps> = ({
  removePlayer,
  userId,
  charId,
  character,
}) => {
  const { addToTurnTracker, user, gameId, userIsOwner } =
    React.useContext(GameDataContext);

  const onRemoveButtonClick = (userId?: string, characterId?: string) => {
    if (userId && characterId && gameId) {
      removePlayer(gameId, userId, characterId);
    }
  };

  const TrackerAddIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={TrackerAddSvg} style={{ fill: "inherit" }} {...props} />
  );
  return (
    <Flex gap={16}>
      <Tooltip title={`Open Character Sheet`}>
        <Button
          icon={<SolutionOutlined />}
          onClick={() => openInNewTab(`/u/${userId}/c/${charId}`)}
          disabled={!userId || !charId}
        />
      </Tooltip>
      <Popconfirm
        title="Remove this character?"
        onConfirm={() => user && onRemoveButtonClick(user.uid, charId)}
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
  );
};

export default PlayerButtons;
