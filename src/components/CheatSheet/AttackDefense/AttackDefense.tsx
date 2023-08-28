import { Typography } from "antd";

export default function AttackDefense() {
  return (
    <Typography.Paragraph>
      The attacker rolls a d20 “to hit” and adds any modifiers, including the +1
      Attack Bonus. If the score is equal to or greater than the target's armor
      class (AC) the attack hits and the attacker rolls damage. A natural “1” on
      the die roll is always a failure. A natural “20” is always a hit, if the
      opponent can be hit at all (e.g., monsters that can only be hit by silver
      or magic weapons cannot be hit by normal weapons, so a natural “20” with a
      normal weapon will miss).
    </Typography.Paragraph>
  );
}
