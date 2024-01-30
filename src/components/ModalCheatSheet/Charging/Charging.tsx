import { Typography } from "antd";

export default function Charging() {
  return (
    <>
      <Typography.Paragraph>
        In some cases, characters or creatures can attack after a running move,
        known as a charge. The charger must move at least 10 feet, up to double
        their normal rate, in a straight line toward the target. The path must
        be clear, and the attacker should use a weapon like a spear, lance, or
        polearm suitable for charging. Monsters with horns can use natural
        attacks. If the attacker lacks line of sight at the start, the opponent
        can't be charged.bl;oo
      </Typography.Paragraph>
      <Typography.Paragraph>
        The post-charge attack gets a +2 on the attack roll, but the charger
        takes a -2 penalty to Armor Class for the round. If the attack hits, it
        deals double damage.
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Set Weapon Against Charge</strong>: Spears, pole arms, and
        certain other piercing weapons deal double damage when “set” (braced
        against the ground or floor) and used against a charging creature. For
        this to be done, the character or creature being charged must have equal
        or better Initiative; this counts as holding an action: both attacker
        and defender act on the attacker's Initiative number and are therefore
        simultaneous.
      </Typography.Paragraph>
    </>
  );
}
