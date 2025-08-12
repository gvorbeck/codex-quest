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
import { rollDice } from "@/support/diceSupport";
import { useNotification } from "@/hooks/useNotification";
import { ModalDisplay } from "@/data/definitions";
import DiceSvg from "@/assets/svg/DiceSvg";

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
    openNotification("Roll Initiative", result.toString());
  }

  return (
    <FloatButton.Group shape="square" className={className}>
      {contextHolder}
      <FloatButton
        icon={<NodeIndexOutlined />}
        tooltip={{
          title: "Roll Initiative",
          className: "font-medium",
          placement: "left",
        }}
        onClick={rollInitiative}
      />
      <FloatButton
        icon={<FileSearchOutlined />}
        tooltip={{
          title: "Cheat Sheet",
          className: "font-medium",
          placement: "left",
        }}
        onClick={handleCheatSheetClick}
      />
      <FloatButton
        icon={<DiceIcon className="fill-ship-gray" />}
        tooltip={{
          title: "Virtual Dice",
          className: "font-medium",
          placement: "left",
        }}
        onClick={handleVirtualDiceClick}
      />
      <FloatButton
        icon={<SettingOutlined />}
        tooltip={{
          title: "Settings",
          className: "font-medium",
          placement: "left",
        }}
        onClick={openSettingsDrawer}
      />
    </FloatButton.Group>
  );
};

export default CharacterFloatButtons;
