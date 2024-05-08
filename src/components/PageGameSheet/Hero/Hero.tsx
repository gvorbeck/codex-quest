import {
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import React from "react";
import AddPlayerForm from "../PlayerList/AddPlayerForm/AddPlayerForm";
import { HourglassOutlined, TeamOutlined } from "@ant-design/icons";
import { GameData } from "@/data/definitions";
import { useDeviceType } from "@/hooks/useDeviceType";
import { breadcrumbItems } from "@/support/cqSupportGeneral";

interface HeroProps {
  game: GameData;
  handlePlayersSwitch: (checked: boolean) => void;
  uid: string | undefined;
  gameId: string | undefined;
  userIsOwner: boolean;
  setTurnTrackerExpanded: (expanded: boolean) => void;
}

const Hero: React.FC<HeroProps & React.ComponentPropsWithRef<"div">> = ({
  className,
  game,
  handlePlayersSwitch,
  uid,
  gameId: id,
  userIsOwner,
  setTurnTrackerExpanded,
}) => {
  const { isMobile } = useDeviceType();

  return (
    <div className={className}>
      <Breadcrumb items={breadcrumbItems(game?.name, TeamOutlined)} />
      <Typography.Title
        level={2}
        className="my-5 font-enchant text-5xl tracking-wide text-center"
      >
        {game.name}
      </Typography.Title>
      <Divider className="my-2" />
      <Flex
        vertical={isMobile}
        align={isMobile ? "flex-start" : "center"}
        gap={8}
      >
        <Flex gap={8} align="center">
          <Typography.Text>Hide PCs</Typography.Text>
          <Switch className="mr-2" onChange={handlePlayersSwitch} />
          <Tooltip title="Open Round Tracker">
            <Button
              icon={<HourglassOutlined />}
              onClick={() => setTurnTrackerExpanded(true)}
            />
          </Tooltip>
        </Flex>
        {uid && id && (
          <AddPlayerForm
            gmId={uid}
            gameId={id}
            userIsOwner={userIsOwner}
            className="mb-4 flex-grow"
          />
        )}
      </Flex>
    </div>
  );
};

export default Hero;
