import { Button } from "antd";
import { AttackButtonsProps } from "./definitions";
import { useState } from "react";

export default function AttackButtons({
  weapon,
  damage,
  attack,
  type,
  className,
  ammo,
  isMissile,
  handleCancel,
}: AttackButtonsProps) {
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
