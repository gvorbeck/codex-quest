import { Button } from "antd";
import { useState } from "react";
import { AttackType, EquipmentItem } from "../../../data/definitions";

type AttackButtonsProps = {
  weapon: EquipmentItem;
  damage?: (damage: string) => void;
  attack: (attack: AttackType) => void;
  type: AttackType;
  ammo?: EquipmentItem;
  isMissile?: boolean;
  handleCancel: () => void;
};

export default function AttackButtons({
  weapon,
  damage,
  attack,
  type,
  className,
  ammo,
  isMissile,
  handleCancel,
}: AttackButtonsProps & React.ComponentPropsWithRef<"div">) {
  const [isDmgBtnDisabled, setIsDmgBtnDisabled] = useState(true);
  const isButtonDisabled =
    type === "missile" && isMissile && !ammo && !weapon.damage;

  return (
    <div className={className}>
      <Button
        type="primary"
        onClick={() => {
          attack(type);
          setIsDmgBtnDisabled(false);
        }}
        disabled={isButtonDisabled}
      >
        Attack Roll
      </Button>
      {damage && (
        <Button
          type="default"
          onClick={() => {
            if (weapon.type === "missile") {
              ammo?.damage && damage(ammo.damage);
            } else {
              weapon.damage && damage(weapon.damage);
            }
            setIsDmgBtnDisabled(true);
            handleCancel();
          }}
          className="ml-2"
          disabled={isButtonDisabled && isDmgBtnDisabled}
        >
          Damage Roll
        </Button>
      )}
    </div>
  );
}
