import {
  Breadcrumb,
  BreadcrumbProps,
  Button,
  Flex,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import React from "react";
import AddPlayerForm from "../PlayerList/AddPlayerForm/AddPlayerForm";
import BreadcrumbHomeLink from "@/components/BreadcrumbHomeLink/BreadcrumbHomeLink";
import { ExclamationCircleOutlined, TeamOutlined } from "@ant-design/icons";
import { GameData } from "@/data/definitions";
import { useDeviceType } from "@/hooks/useDeviceType";

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
  const breadcrumbItems: BreadcrumbProps["items"] = [
    {
      title: <BreadcrumbHomeLink />,
    },
    {
      title: (
        <div>
          <TeamOutlined className="mr-2" />
          <span>{game?.name}</span>
        </div>
      ),
    },
  ];
  return (
    <div className={className}>
      <Breadcrumb items={breadcrumbItems} />
      <Typography.Title
        level={2}
        className="m-0 font-enchant text-5xl tracking-wide text-center"
      >
        {game.name}
      </Typography.Title>
      <Flex
        vertical={isMobile}
        align={isMobile ? "flex-start" : "center"}
        gap={16}
      >
        <Flex gap={8}>
          <Typography.Text>Hide PCs</Typography.Text>
          <Switch onChange={handlePlayersSwitch} />
        </Flex>
        <Tooltip title="Open Turn Tracker">
          <Button
            icon={<ExclamationCircleOutlined />}
            onClick={() => setTurnTrackerExpanded(true)}
          />
        </Tooltip>
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
