import { Button } from "antd";
import { AttackButtonsProps } from "./definitions";

export default function AttackButtons({
  weapon,
  damage,
  attack,
  type,
  className,
  ammo,
  isMissile,
}: AttackButtonsProps) {
  const isButtonDisabled =
    type === "missile" && isMissile && !ammo && !weapon.damage;

  return (
    <div className={className}>
      <Button
        type="primary"
        onClick={() => attack(type)}
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
          }}
          className="ml-2"
          disabled={isButtonDisabled}
        >
          Damage Roll
        </Button>
      )}
    </div>
  );
}
