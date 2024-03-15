import AllSpellsSelection from "@/components/PageNewCharacter/StepClass/AllSpellsSelection/AllSpellsSelection";
import StepEquipment from "@/components/PageNewCharacter/StepEquipment/StepEquipment";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import { ColorScheme } from "@/support/colorSupport";
import { Button, Divider, Drawer, Flex } from "antd";
import React from "react";
import CantripSelection from "../CantripSelection/CantripSelection";
import CustomCantripForm from "../CustomCantripForm/CustomCantripForm";
import FormCustomSpell from "@/components/PageCharacterSheet/FormCustomSpell/FormCustomSpell";
import FormCustomEquipment from "../FormCustomEquipment/FormCustomEquipment";

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
  const [showCustomSpellForm, setShowCustomSpellForm] = React.useState(false);
  const [showSpellSelection, setShowSpellSelection] = React.useState(false);
  const [showCustomEquipmentForm, setShowCustomEquipmentForm] =
    React.useState(false);

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
    setShowCustomEquipmentForm(
      (prevShowCustomEquipmentForm) => !prevShowCustomEquipmentForm,
    );
  };
  const handleCustomSpellClick = () => {
    setShowCustomSpellForm(
      (prevShowCustomSpellForm) => !prevShowCustomSpellForm,
    );
  };
  const handleAddEditSpellClick = () => {
    setShowSpellSelection((prevShowSpellSelection) => !prevShowSpellSelection);
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
        {showCustomEquipmentForm && <FormCustomEquipment />}
        {isSpellCaster && (
          <>
            <Divider className="font-enchant text-2xl">Spells</Divider>
            <Button onClick={handleAddEditSpellClick}>Add/Edit Spells</Button>
            {showSpellSelection && <AllSpellsSelection hideStartingText />}
            <Button onClick={handleCustomSpellClick}>Add Custom Spell</Button>
            {showCustomSpellForm && <FormCustomSpell />}
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
            {showCustomCantripForm && (
              <CustomCantripForm
                setShowCustomCantripForm={setShowCustomCantripForm}
              />
            )}
          </>
        )}
      </Flex>
    </Drawer>
  );
};

export default SettingsDrawer;
