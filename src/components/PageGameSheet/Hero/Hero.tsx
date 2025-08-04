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
import CoinsSvg from "@/assets/svg/CoinsSvg";
import ModalContainer from "@/components/ModalContainer/ModalContainer";
import { useModal } from "@/hooks/useModal";
import TreasureGenerator from "../TreasureGenerator/TreasureGenerator";
import MonsterSvg from "@/assets/svg/MonsterSvg";
import EncounterGenerator from "../EncounterGenerator/EncounterGenerator";

interface HeroProps {
  handlePlayersSwitch: (checked: boolean) => void;
  handleRoundTrackerOpen: () => void;
  name: string;
}

const Hero: React.FC<HeroProps> = ({
  handlePlayersSwitch,
  handleRoundTrackerOpen,
  name,
}) => {
  const { isMobile } = useDeviceType();
  const { modalDisplay, setModalDisplay, modalOkRef } = useModal();

  function handleTreasureModalClick() {
    setModalDisplay({
      isOpen: true,
      title: "Treasure Generator",
      content: <TreasureGenerator />,
    });
  }

  function handleRandomEncounterModalClick() {
    setModalDisplay({
      isOpen: true,
      title: "Random Encounter Generator",
      content: <EncounterGenerator />,
    });
  }

  return (
    <>
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
            <Tooltip title="Open Treasure Generator">
              <Button
                icon={<CoinsSvg className="w-6" />}
                onClick={handleTreasureModalClick}
              />
            </Tooltip>
            <Tooltip title="Open Random Encounter Generator">
              <Button
                icon={<MonsterSvg className="w-6" />}
                onClick={handleRandomEncounterModalClick}
              />
            </Tooltip>
          </Flex>
          <AddPlayerForm className="mb-4 grow" />
        </Flex>
      </header>
      <ModalContainer
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
        modalOk={modalOkRef.current}
      />
    </>
  );
};

export default Hero;
