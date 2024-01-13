import React from "react";
import { CharData, EquipmentItem } from "@/data/definitions";
import AttackForm from "../AttackForm/AttackForm";
import { useAttack } from "@/hooks/useAttack";
import { Flex, Form, Select, Typography } from "antd";
import { sendAmmoAttackNotifications } from "../ModalAttackSupport";

interface ThrownAttackFormProps {
  item: EquipmentItem;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  character: CharData;
  setCharacter: (character: CharData) => void;
  equipment: EquipmentItem[];
}

const ThrownAttackForm: React.FC<
  ThrownAttackFormProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  item,
  setModalIsOpen,
  equipment,
  character,
  setCharacter,
}) => {
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
  const ammoSelection = item.name;
  const rangeOptions = getRangeOptions(item.range);
  const resetFormState = () => {
    setRange(undefined);
    setModalIsOpen(false);
  };
  const onFinish = () => {
    const weaponRecovered = updateEquipmentAfterMissileAttack(
      ammoSelection,
      equipment,
      false,
      character,
      setCharacter,
    );
    const { rollToHit, rollToDamage } = calculateMissileRollResults(
      character,
      range,
      equipment,
      ammoSelection,
      true,
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
  return (
    <>
      {contextHolder}
      <Flex gap={8}>
        <Typography.Text strong>Using:</Typography.Text>
        <Typography.Text>{item.name}</Typography.Text>
      </Flex>
      <AttackForm
        onFinish={onFinish}
        initialValues={{}}
        name="thrown-attack"
        className={className}
        submitDisabled={!range}
      >
        {item.range && (
          <Form.Item label="Range">
            <Select
              value={range}
              onChange={handleRangeChange}
              options={rangeOptions}
              placeholder={"Select range"}
            />
          </Form.Item>
        )}
      </AttackForm>
    </>
  );
};

export default ThrownAttackForm;
