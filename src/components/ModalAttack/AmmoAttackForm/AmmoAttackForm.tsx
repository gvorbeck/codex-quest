import { EquipmentItem, ModalDisplay } from "@/data/definitions";
import React from "react";
import AttackForm from "../AttackForm/AttackForm";
import { Checkbox, Flex, Form, Select, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import {
  getAvailableAmmoOptions,
  getAvailableAmmoSelectOptions,
  noAmmoMessage,
  sendAmmoAttackNotifications,
} from "../ModalAttackSupport";
import { useAttack } from "@/hooks/useAttack";
import { CharacterDataContext } from "@/store/CharacterContext";

interface AmmoAttackFormProps {
  // character: CharData;
  // setCharacter: (character: CharData) => void;
  item: EquipmentItem;
  // equipment: EquipmentItem[];
  // setModalIsOpen: (modalIsOpen: boolean) => void;
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
}

const AmmoAttackForm: React.FC<
  AmmoAttackFormProps & React.ComponentPropsWithRef<"div">
> = ({ className, item, setModalDisplay }) => {
  // HOOKS
  const {
    range,
    setRange,
    contextHolder,
    openNotification,
    getRangeOptions,
    handleRangeChange,
    updateEquipmentAfterMissileAttack,
    calculateMissileRollResults,
  } = useAttack();
  const { character, setCharacter } = React.useContext(CharacterDataContext);
  const [ammoSelection, setAmmoSelection] = React.useState<string | undefined>(
    undefined,
  );
  const [ammoSelectionMessage, setAmmoSelectionMessage] =
    React.useState<string>(noAmmoMessage);
  const [isRecoveryChecked, setIsRecoveryChecked] =
    React.useState<boolean>(false);
  // VARS
  const rangeOptions = getRangeOptions(item.range);
  const availableAmmoOptions = React.useMemo(
    () => getAvailableAmmoOptions(item.ammo, character.equipment) ?? [],
    [item, character.equipment],
  );
  const availableAmmoSelectOptions = React.useMemo(
    () => getAvailableAmmoSelectOptions(availableAmmoOptions) ?? [],
    [availableAmmoOptions],
  );
  // FUNCTIONS
  const resetFormState = () => {
    setRange(undefined);
    setAmmoSelection(undefined);
    setAmmoSelectionMessage(noAmmoMessage);
    setIsRecoveryChecked(false);
    setModalDisplay((prevModalDisplay) => ({
      ...prevModalDisplay,
      isOpen: false,
    }));
  };
  const onFinish = () => {
    const weaponRecovered = updateEquipmentAfterMissileAttack(
      ammoSelection,
      isRecoveryChecked,
      character,
      setCharacter,
    );
    const { rollToHit, rollToDamage } = calculateMissileRollResults(
      character,
      range,
      ammoSelection,
    );
    sendAmmoAttackNotifications(
      weaponRecovered,
      rollToHit,
      rollToDamage,
      openNotification,
      ammoSelection,
      item,
    );
    resetFormState();
  };
  const handleSelectChange = (value: string) => {
    setAmmoSelection(value);
    setAmmoSelectionMessage(value);
  };
  const handleRecoveryChange = (e: CheckboxChangeEvent) => {
    setIsRecoveryChecked(e.target.checked);
  };
  // EFFECTS
  React.useEffect(() => {
    if (availableAmmoOptions.length > 1) {
      !ammoSelection && setAmmoSelectionMessage("No ammunition selected");
    }
    if (availableAmmoOptions.length === 1) {
      setAmmoSelection(availableAmmoOptions[0].name);
      setAmmoSelectionMessage(availableAmmoOptions[0].name);
    }
    if (!availableAmmoOptions) {
      setAmmoSelection(undefined);
      setAmmoSelectionMessage(noAmmoMessage);
    }
  }, [ammoSelection, availableAmmoOptions]);
  // JSX
  return (
    <>
      {contextHolder}
      <Flex gap={8}>
        <Typography.Text strong>Using:</Typography.Text>
        <Typography.Text>
          {!availableAmmoOptions?.length
            ? "No ammunition available!"
            : ammoSelectionMessage}
        </Typography.Text>
      </Flex>
      <AttackForm
        onFinish={onFinish}
        initialValues={{}}
        name="ammo-attack"
        className={className}
        submitDisabled={
          !range || !availableAmmoOptions?.length || !ammoSelection
        }
      >
        {availableAmmoOptions?.length > 1 && (
          <Form.Item label="Ammunition">
            <Select
              value={ammoSelection}
              onChange={(value) => handleSelectChange(value)}
              options={availableAmmoSelectOptions}
              placeholder={"Select ammunition"}
            />
          </Form.Item>
        )}
        {item.range && (
          <Form.Item label="Range">
            <Select
              value={range}
              onChange={handleRangeChange}
              options={rangeOptions}
              placeholder={"Select range"}
              disabled={!availableAmmoOptions?.length}
            />
          </Form.Item>
        )}
        <Form.Item>
          <Checkbox checked={isRecoveryChecked} onChange={handleRecoveryChange}>
            25% chance to recover ammo
          </Checkbox>
        </Form.Item>
      </AttackForm>
    </>
  );
};

export default AmmoAttackForm;
