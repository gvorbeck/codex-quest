import TrackerAddSvg from "@/assets/svg/TrackerAddSvg";
import { CharData, CombatantType, CombatantTypes } from "@/data/definitions";
import { TurnTrackerDataContext } from "@/store/TurnTrackerContext";
import { openInNewTab } from "@/support/characterSupport";
import { SolutionOutlined, UserDeleteOutlined } from "@ant-design/icons";
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";
import { Button, Flex, Popconfirm, Tooltip } from "antd";
import { User } from "firebase/auth";
import React from "react";

interface PlayerButtonsProps {
  // removePlayer: (
  //   gameId: string,
  //   userId: string,
  //   characterId: string,
  // ) => Promise<void>;
  // gameId: string;
  // userId: string | undefined;
  // charId: string | undefined;
  // user: User | null;
  // userIsOwner: boolean;
  // addToTurnTracker: (
  //   data: CombatantType | CharData,
  //   type: CombatantTypes,
  // ) => void;
  // character: CharData;
}

const PlayerButtons: React.FC<
  PlayerButtonsProps & React.ComponentPropsWithRef<"div">
> = () =>
  // {
  // className,
  // removePlayer,
  // gameId,
  // userId,
  // charId,
  // user,
  // userIsOwner,
  // addToTurnTracker,
  // character,
  // },
  {
    const { addToTurnTracker } = React.useContext(TurnTrackerDataContext);
    console.log(addToTurnTracker);
    // const onRemoveButtonClick = (userId?: string, characterId?: string) => {
    //   userId && characterId && removePlayer(gameId, userId, characterId);
    // };

    // const TrackerAddIcon = (props: Partial<CustomIconComponentProps>) => (
    //   <Icon component={TrackerAddSvg} {...props} />
    // );
    return (
      <div>hello</div>
      // <Flex gap={16} className={className}>
      //   <Tooltip title={`Open Character Sheet`}>
      //     <Button
      //       icon={<SolutionOutlined />}
      //       onClick={() => openInNewTab(`/u/${userId}/c/${charId}`)}
      //     />
      //   </Tooltip>
      //   <Popconfirm
      //     title="Remove this character?"
      //     onConfirm={() => user && onRemoveButtonClick(user.uid, charId)}
      //     okText="Yes"
      //     cancelText="No"
      //     disabled={!userIsOwner}
      //   >
      //     <Tooltip title={`Remove Character`} placement="bottom">
      //       <Button icon={<UserDeleteOutlined />} />
      //     </Tooltip>
      //   </Popconfirm>
      //   <Tooltip title="Add to Round Tracker">
      //     <Button
      //       onClick={() => addToTurnTracker(character, "player")}
      //       className="[&:hover_svg]:fill-seaBuckthorn"
      //       icon={<TrackerAddIcon />}
      //     />
      //   </Tooltip>
      // </Flex>
    );
  };

export default PlayerButtons;
