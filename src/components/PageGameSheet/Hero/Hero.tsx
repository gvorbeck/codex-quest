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
import AddPlayerForm from "../AddPlayerForm/AddPlayerForm";
import { HourglassOutlined, TeamOutlined } from "@ant-design/icons";
import { useDeviceType } from "@/hooks/useDeviceType";
import { breadcrumbItems } from "@/support/cqSupportGeneral";

interface HeroProps {
  gameId: string | undefined;
  handlePlayersSwitch: (checked: boolean) => void;
  handleRoundTrackerOpen: () => void;
  name: string;
  userId: string | undefined;
}

const Hero: React.FC<HeroProps> = ({
  gameId,
  handlePlayersSwitch,
  handleRoundTrackerOpen,
  name,
  userId,
}) => {
  const { isMobile } = useDeviceType();

  return (
    <header>
      <Breadcrumb items={breadcrumbItems(name, TeamOutlined)} />
      <Typography.Title
        level={2}
        className="my-5 font-enchant text-5xl tracking-wide text-center"
      >
        {name}
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
              onClick={handleRoundTrackerOpen}
            />
          </Tooltip>
        </Flex>
        {userId && gameId && (
          <AddPlayerForm
            gameId={gameId}
            userId={userId}
            userIsOwner
            className="mb-4 flex-grow"
          />
        )}
      </Flex>
    </header>
  );
};

export default Hero;
