import { FileSearchOutlined, NodeIndexOutlined } from "@ant-design/icons";
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";
import { FloatButton } from "antd";
import React from "react";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import { useCharacterDice } from "@/hooks/useCharacterDice";
import { ColorScheme } from "@/support/colorSupport";
import ModalCheatSheet from "@/components/ModalCheatSheet/ModalCheatSheet";
import ModalVirtualDice from "@/components/ModalVirtualDice/ModalVirtualDice";

interface CharacterFloatButtonsProps {
  setModalIsOpen: (modalIsOpen: boolean) => void;
  setModalTitle: (modalTitle: string) => void;
  setModalContent: (modalContent: React.ReactNode) => void;
  modalOk: (() => void | undefined) | null | undefined;
}

const DiceSvg = () => (
  <svg
    width={16}
    height={16}
    fill={ColorScheme.SHIPGRAY}
    stroke={ColorScheme.SHIPGRAY}
    opacity={0.75}
    strokeWidth={0.4}
  >
    <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z" />
    <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
  </svg>
);

const DiceIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DiceSvg} {...props} />
);

const CharacterFloatButtons: React.FC<
  CharacterFloatButtonsProps & React.ComponentPropsWithRef<"div">
> = ({ className, setModalContent, setModalIsOpen, setModalTitle }) => {
  const { character } = React.useContext(CharacterDataContext);
  const { rollInitiative, contextHolder } = useCharacterDice(character);
  const handleCheatSheetClick = () => {
    setModalContent(<ModalCheatSheet />);
    setModalTitle("Cheat Sheet");
    setModalIsOpen(true);
  };
  const handleVirtualDiceClick = () => {
    setModalContent(<ModalVirtualDice />);
    setModalTitle("Virtual Dice");
    setModalIsOpen(true);
  };
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
    </FloatButton.Group>
  );
};

export default CharacterFloatButtons;
