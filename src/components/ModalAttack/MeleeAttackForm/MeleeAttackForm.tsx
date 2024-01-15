import { CharData, EquipmentItem } from "@/data/definitions";
import React from "react";
import AttackForm from "../AttackForm/AttackForm";
import { useAttack } from "@/hooks/useAttack";
import { getRollToHitResult } from "../ModalAttackSupport";
import { rollDice } from "@/support/diceSupport";

interface MeleeAttackFormProps {
  character: CharData;
  item: EquipmentItem;
  setModalIsOpen: (modalIsOpen: boolean) => void;
}

const MeleeAttackForm: React.FC<
  MeleeAttackFormProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, item, setModalIsOpen }) => {
  const { contextHolder, openNotification } = useAttack();

  const onFinish = () => {
    // Melee to-hit roll: 1d20 + attack bonus + strength modifier
    const rollToHit = getRollToHitResult(character);
    // Assuming melee damage is on the item and includes the character's strength modifier
    const rollToDamage = rollDice(item.damage || "");

    // Handle notifications
    openNotification(
      `Attack with ${item.name}`,
      `To-hit: ${rollToHit.total} Damage: ${rollToDamage}`,
    );

    // Reset modal state
    setModalIsOpen(false);
  };

  return (
    <>
      {contextHolder}
      <AttackForm
        onFinish={onFinish}
        initialValues={{}}
        name="melee-attack"
        className={className}
      >
        {/* Additional form items for melee attack could be placed here */}
      </AttackForm>
    </>
  );
};

export default MeleeAttackForm;
