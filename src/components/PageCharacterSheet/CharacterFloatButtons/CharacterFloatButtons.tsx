import {
  FileSearchOutlined,
  NodeIndexOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";
import { FloatButton } from "antd";
import React from "react";
import { CharacterDataContext } from "@/store/CharacterContext";
import ModalCheatSheet from "@/components/ModalCheatSheet/ModalCheatSheet";
import ModalVirtualDice from "@/components/ModalVirtualDice/ModalVirtualDice";
import { DiceSvg } from "@/support/svgSupport";
import { rollDice } from "@/support/diceSupport";
import { useNotification } from "@/hooks/useNotification";
import { ModalDisplay } from "@/data/definitions";

interface CharacterFloatButtonsProps {
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
  modalOk: (() => void | undefined) | null | undefined;
  openSettingsDrawer: () => void;
}

const DiceIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DiceSvg} {...props} />
);

const CharacterFloatButtons: React.FC<
  CharacterFloatButtonsProps & React.ComponentPropsWithRef<"div">
> = ({ className, setModalDisplay, openSettingsDrawer }) => {
  const { character } = React.useContext(CharacterDataContext);
  const { contextHolder, openNotification } = useNotification();

  function handleCheatSheetClick() {
    setModalDisplay({
      isOpen: true,
      title: "Cheat Sheet",
      content: <ModalCheatSheet />,
    });
  }

  function handleVirtualDiceClick() {
    setModalDisplay({
      isOpen: true,
      title: "Virtual Dice",
      content: <ModalVirtualDice />,
    });
  }

  function rollInitiative() {
    const result = rollDice(`1d6${character.abilities.modifiers.dexterity}`);
    openNotification("Roll Initiative", result);
  }

  return (
    <FloatButton.Group shape="square" className={className}>
      {contextHolder}
      <FloatButton
        icon={<NodeIndexOutlined />}
        tooltip={<div>Roll Initiative</div>}
        onClick={rollInitiative}
      />
      <FloatButton
        icon={<FileSearchOutlined />}
        tooltip={<div>Cheat Sheet</div>}
        onClick={handleCheatSheetClick}
      />
      <FloatButton
        icon={<DiceIcon className="fill-shipGray" />}
        tooltip={<div>Virtual Dice</div>}
        onClick={handleVirtualDiceClick}
      />
      <FloatButton
        icon={<SettingOutlined />}
        tooltip={<div>Settings</div>}
        onClick={openSettingsDrawer}
      />
    </FloatButton.Group>
  );
};

export default CharacterFloatButtons;
