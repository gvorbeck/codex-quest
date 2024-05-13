import React from "react";
import { EquipmentItem, ModalDisplay } from "@/data/definitions";
import AttackForm from "../AttackForm/AttackForm";
import { useAttack } from "@/hooks/useAttack";
import { Flex, Form, Select, Typography } from "antd";
import { sendAmmoAttackNotifications } from "../ModalAttackSupport";
import { CharacterDataContext } from "@/store/CharacterContext";

interface ThrownAttackFormProps {
  item: EquipmentItem;
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
}

const ThrownAttackForm: React.FC<
  ThrownAttackFormProps & React.ComponentPropsWithRef<"div">
> = ({ className, item, setModalDisplay }) => {
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
  const ammoSelection = item.name;
  const rangeOptions = getRangeOptions(item.range);
  const resetFormState = () => {
    setRange(undefined);
    setModalDisplay((prevModalDisplay) => ({
      ...prevModalDisplay,
      isOpen: false,
    }));
  };
  const onFinish = () => {
    const weaponRecovered = updateEquipmentAfterMissileAttack(
      ammoSelection,
      false,
      character,
      setCharacter,
    );
    const { rollToHit, rollToDamage } = calculateMissileRollResults(
      character,
      range,
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
