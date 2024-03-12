import ModalCustomEquipment from "@/components/ModalCustomEquipment/ModalCustomEquipment";
import StepEquipment from "@/components/PageNewCharacter/StepEquipment/StepEquipment";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import { ColorScheme } from "@/support/colorSupport";
import { Button, Divider, Drawer, Flex } from "antd";
import React from "react";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  isSpellCaster: boolean;
  setModalTitle: (modalTitle: string) => void;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  setModalContent: (modalContent: React.ReactNode) => void;
}

const SettingsDrawer: React.FC<
  SettingsDrawerProps & React.ComponentPropsWithRef<"div">
> = ({
  open,
  onClose,
  className,
  isSpellCaster,
  setModalTitle,
  setModalIsOpen,
  setModalContent,
}) => {
  const { character, setCharacter } = React.useContext(CharacterDataContext);
  const handleEditEquipmentClick = () => {
    setModalIsOpen(true);
    setModalTitle("Add/Edit Equipment");
    setModalContent(
      <StepEquipment
        character={character}
        setCharacter={setCharacter}
        hideDiceButton
        hideInventory
      />,
    );
  };

  const handleCustomEquipmentClick = () => {
    setModalIsOpen(true);
    setModalTitle("Add Custom Equipment");
    setModalContent(
      <ModalCustomEquipment
        character={character}
        setCharacter={setCharacter}
        setModalIsOpen={setModalIsOpen}
      />,
    );
  };
  return (
    <Drawer
      title="Settings"
      onClose={onClose}
      open={open}
      styles={{ header: { background: ColorScheme.SEABUCKTHORN } }}
      className={className}
    >
      <Flex vertical gap={16}>
        <Divider className="font-enchant text-2xl">Equipment</Divider>
        <Button onClick={handleEditEquipmentClick}>Add/Edit Equipment</Button>
        <Button onClick={handleCustomEquipmentClick}>
          Add Custom Equipment
        </Button>
        <Divider className="font-enchant text-2xl">Magic</Divider>
        {isSpellCaster && (
          <>
            <Button>Add/Edit Spells</Button>
            <Button>Add Custom Spell</Button>
          </>
        )}
        <Button>Add 0 Level Spells</Button>
      </Flex>
    </Drawer>
  );
};

export default SettingsDrawer;
