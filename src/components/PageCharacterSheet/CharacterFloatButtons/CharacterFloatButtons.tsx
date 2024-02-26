import { FileSearchOutlined, NodeIndexOutlined } from "@ant-design/icons";
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";
import { FloatButton } from "antd";
import React from "react";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import { useCharacterDice } from "@/hooks/useCharacterDice";
import ModalCheatSheet from "@/components/ModalCheatSheet/ModalCheatSheet";
import ModalVirtualDice from "@/components/ModalVirtualDice/ModalVirtualDice";
import { DiceSvg } from "@/support/svgSupport";

interface CharacterFloatButtonsProps {
  setModalIsOpen: (modalIsOpen: boolean) => void;
  setModalTitle: (modalTitle: string) => void;
  setModalContent: (modalContent: React.ReactNode) => void;
  modalOk: (() => void | undefined) | null | undefined;
}

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
