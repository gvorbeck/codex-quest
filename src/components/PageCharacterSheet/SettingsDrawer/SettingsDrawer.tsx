import StepEquipment from "@/components/PageNewCharacter/StepEquipment/StepEquipment";
import { CharacterDataContext } from "@/store/CharacterContext";
import { ColorScheme } from "@/support/colorSupport";
import { Button, Divider, Drawer, Flex, Switch, Typography } from "antd";
import React from "react";
import CantripSelection from "../CantripSelection/CantripSelection";
import CustomCantripForm from "../CustomCantripForm/CustomCantripForm";
import FormCustomSpell from "@/components/PageCharacterSheet/FormCustomSpell/FormCustomSpell";
import FormCustomEquipment from "../FormCustomEquipment/FormCustomEquipment";
import CqDivider from "@/components/CqDivider/CqDivider";

const AllSpellsSelection = React.lazy(
  () =>
    import(
      "@/components/PageNewCharacter/StepClass/AllSpellsSelection/AllSpellsSelection"
    ),
);

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  isSpellCaster: boolean;
}

const SettingsDrawer: React.FC<
  SettingsDrawerProps & React.ComponentPropsWithRef<"div">
> = ({ open, onClose, className, isSpellCaster }) => {
  const { character, characterDispatch } =
    React.useContext(CharacterDataContext);

  const [showCustomCantripForm, setShowCustomCantripForm] =
    React.useState(false);
  const [showCantripSelection, setShowCantripSelection] = React.useState(false);
  const [showCustomSpellForm, setShowCustomSpellForm] = React.useState(false);
  const [showSpellSelection, setShowSpellSelection] = React.useState(false);
  const [showCustomEquipmentForm, setShowCustomEquipmentForm] =
    React.useState(false);
  const [showEditEquipmentForm, setShowEditEquipmentForm] =
    React.useState(false);

  const handleEditEquipmentClick = () => {
    setShowEditEquipmentForm(
      (prevShowEditEquipmentForm) => !prevShowEditEquipmentForm,
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
  const handleResetFormDisplay = () => {
    setShowCustomCantripForm(false);
    setShowCantripSelection(false);
    setShowCustomSpellForm(false);
    setShowSpellSelection(false);
    setShowCustomEquipmentForm(false);
    setShowEditEquipmentForm(false);
  };

  function handleChangeCoinWeight(checked: boolean) {
    characterDispatch({ type: "UPDATE", payload: { useCoinWeight: checked } });
  }

  return (
    <Drawer
      title="Settings"
      onClose={onClose}
      open={open}
      styles={{ header: { background: ColorScheme.SEABUCKTHORN } }}
      className={className}
    >
      <Flex vertical gap={16}>
        <CqDivider>Equipment</CqDivider>
        <Button onClick={handleEditEquipmentClick}>Add/Edit Equipment</Button>
        {showEditEquipmentForm && (
          <StepEquipment
            character={character}
            characterDispatch={characterDispatch}
            hideDiceButton
            hideInventory
          />
        )}
        <Button onClick={handleCustomEquipmentClick}>
          Add Custom Equipment
        </Button>
        {showCustomEquipmentForm && (
          <FormCustomEquipment
            handleResetFormDisplay={handleResetFormDisplay}
          />
        )}
        {isSpellCaster && (
          <>
            <CqDivider>Spells</CqDivider>
            <Button onClick={handleAddEditSpellClick}>Add/Edit Spells</Button>
            {showSpellSelection && (
              <React.Suspense fallback={<div>Loading spells...</div>}>
                <AllSpellsSelection
                  character={character}
                  characterDispatch={characterDispatch}
                  hideStartingText
                />
              </React.Suspense>
            )}
            <Button onClick={handleCustomSpellClick}>Add Custom Spell</Button>
            {showCustomSpellForm && (
              <FormCustomSpell
                handleResetFormDisplay={handleResetFormDisplay}
              />
            )}
            <Divider className="font-enchant text-2xl">
              Cantrips/Orisons
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
                handleResetFormDisplay={handleResetFormDisplay}
              />
            )}
          </>
        )}
        <Flex gap={8}>
          <Typography.Text>Use coin weight?</Typography.Text>
          <Switch
            className="self-start"
            checked={character.useCoinWeight}
            onChange={handleChangeCoinWeight}
          />
        </Flex>
      </Flex>
    </Drawer>
  );
};

export default SettingsDrawer;
