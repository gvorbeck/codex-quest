import { Typography } from "antd";

export default function Damage() {
  return (
    <>
      <Typography.Paragraph>
        If an attack hits, the attacker rolls damage as given for the weapon.
        Melee attacks apply the Strength bonus or penalty to the damage dice, as
        do thrown missile weapons such as daggers or spears. Usually, attacks
        with bows or crossbows do not gain the Strength bonus, but sling bullets
        or stones do.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Also, magic weapons will add their bonuses to damage (and cursed weapons
        will apply their penalty). Note that, regardless of any penalties to
        damage, any successful hit will do at least one point of damage. As
        explained elsewhere, a creature or character reduced to 0 hit points is
        dead.
      </Typography.Paragraph>
    </>
  );
}
