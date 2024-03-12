import ModalCustomEquipment from "@/components/ModalCustomEquipment/ModalCustomEquipment";
import ModalCustomSpell from "@/components/ModalCustomSpell/ModalCustomSpell";
import AllSpellsSelection from "@/components/PageNewCharacter/StepClass/AllSpellsSelection/AllSpellsSelection";
import StepEquipment from "@/components/PageNewCharacter/StepEquipment/StepEquipment";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import { ColorScheme } from "@/support/colorSupport";
import { Button, Divider, Drawer, Flex } from "antd";
import React from "react";
import CantripSelection from "../CantripSelection/CantripSelection";
import CustomCantripForm from "../CustomCantripForm/CustomCantripForm";

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
  const [showCustomCantripForm, setShowCustomCantripForm] =
    React.useState(false);
  const [showCantripSelection, setShowCantripSelection] = React.useState(false);
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
  const handleCustomSpellClick = () => {
    setModalIsOpen(true);
    setModalTitle("Add Custom Spell");
    setModalContent(
      <ModalCustomSpell
        character={character}
        setCharacter={setCharacter}
        setModalIsOpen={setModalIsOpen}
      />,
    );
  };
  const handleAddEditSpellClick = () => {
    setModalIsOpen(true);
    setModalTitle("Add/Edit Spells");
    setModalContent(
      <AllSpellsSelection
        character={character}
        setCharacter={setCharacter}
        hideStartingText
        className=""
      />,
    );
  };
  const handleAddEditCantripClick = () => {
    setShowCantripSelection(
      (prevShowCantripSelection) => !prevShowCantripSelection,
    );
  };
  const handleCustomCantripClick = () => {
    setShowCustomCantripForm(
      (prevShowCustomCantripForm) => !prevShowCustomCantripForm,
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
            <Button onClick={handleAddEditSpellClick}>Add/Edit Spells</Button>
            <Button onClick={handleCustomSpellClick}>Add Custom Spell</Button>
            <Divider className="font-enchant text-2xl">
              Cantrips/Osirons
            </Divider>
            <Button onClick={handleAddEditCantripClick}>
              Add/Edit 0 Level Spells
            </Button>
            {showCantripSelection && <CantripSelection />}
            <Button onClick={handleCustomCantripClick}>
              Add Custom 0 Level Spells
            </Button>
            {showCustomCantripForm && <CustomCantripForm />}
          </>
        )}
      </Flex>
    </Drawer>
  );
};

export default SettingsDrawer;
