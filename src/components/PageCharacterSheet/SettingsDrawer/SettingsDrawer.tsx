import AllSpellsSelection from "@/components/PageNewCharacter/StepClass/AllSpellsSelection/AllSpellsSelection";
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
import { DrawerForms, EquipmentItem } from "@/data/definitions";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  isSpellCaster: boolean;
  drawerForms: DrawerForms;
  setDrawerForms: React.Dispatch<React.SetStateAction<DrawerForms>>;
  editItem?: EquipmentItem;
}

const SettingsDrawer: React.FC<
  SettingsDrawerProps & React.ComponentPropsWithRef<"div">
> = ({
  open,
  onClose,
  className,
  isSpellCaster,
  drawerForms,
  setDrawerForms,
  editItem,
}) => {
  const { character, characterDispatch } =
    React.useContext(CharacterDataContext);

  const handleEditEquipmentClick = () => {
    setDrawerForms((prevDrawerForms) => ({
      equipment: { add: !prevDrawerForms.equipment.add, form: false },
      spells: { add: false, form: false },
      cantrips: { add: false, form: false },
    }));
  };
  const handleCustomEquipmentClick = () => {
    setDrawerForms((prevDrawerForms) => ({
      equipment: { add: false, form: !prevDrawerForms.equipment.form },
      spells: { add: false, form: false },
      cantrips: { add: false, form: false },
    }));
  };
  const handleCustomSpellClick = () => {
    setDrawerForms((prevDrawerForms) => ({
      equipment: { add: false, form: false },
      spells: { add: false, form: !prevDrawerForms.spells.form },
      cantrips: { add: false, form: false },
    }));
  };
  const handleAddEditSpellClick = () => {
    setDrawerForms((prevDrawerForms) => ({
      equipment: { add: false, form: false },
      spells: { add: !prevDrawerForms.spells.add, form: false },
      cantrips: { add: false, form: false },
    }));
  };
  const handleAddEditCantripClick = () => {
    setDrawerForms((prevDrawerForms) => ({
      equipment: { add: false, form: false },
      spells: { add: false, form: false },
      cantrips: { add: !prevDrawerForms.cantrips.add, form: false },
    }));
  };
  const handleCustomCantripClick = () => {
    setDrawerForms((prevDrawerForms) => ({
      equipment: { add: false, form: false },
      spells: { add: false, form: false },
      cantrips: { add: false, form: !prevDrawerForms.cantrips.form },
    }));
  };
  const handleResetFormDisplay = () => {
    setDrawerForms({
      equipment: { add: false, form: false },
      spells: { add: false, form: false },
      cantrips: { add: false, form: false },
    });
  };

  function handleChangeCoinWeight(checked: boolean) {
    characterDispatch({
      type: "UPDATE",
      payload: {
        useCoinWeight: checked,
      },
    });
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
        <Button onClick={handleEditEquipmentClick}>Default Equipment</Button>
        {drawerForms.equipment.add && (
          <StepEquipment
            character={character}
            characterDispatch={characterDispatch}
            hideDiceButton
            hideInventory
          />
        )}
        <Button onClick={handleCustomEquipmentClick}>Custom Equipment</Button>
        {(drawerForms.equipment.form || editItem) && (
          <FormCustomEquipment
            handleResetFormDisplay={handleResetFormDisplay}
            editItem={editItem}
          />
        )}
        {isSpellCaster && (
          <>
            <CqDivider>Spells</CqDivider>
            <Button onClick={handleAddEditSpellClick}>Default Spells</Button>
            {drawerForms.spells.add && (
              <AllSpellsSelection
                character={character}
                characterDispatch={characterDispatch}
                hideStartingText
              />
            )}
            <Button onClick={handleCustomSpellClick}>Custom Spell</Button>
            {drawerForms.spells.form && (
              <FormCustomSpell
                handleResetFormDisplay={handleResetFormDisplay}
              />
            )}
            <Divider className="font-enchant text-2xl">
              Cantrips/Orisons
            </Divider>
            <Button onClick={handleAddEditCantripClick}>
              Default 0 Level Spells
            </Button>
            {drawerForms.cantrips.add && <CantripSelection />}
            <Button onClick={handleCustomCantripClick}>
              Custom 0 Level Spells
            </Button>
            {drawerForms.cantrips.form && (
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
