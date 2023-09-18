import { Typography } from "antd";

export default function CombatMovement() {
  return (
    <>
      <Typography.Paragraph>
        When opponents are over 5' apart, they move freely. Within 5', they're
        "engaged" and follow Defensive Movement rules. Sometimes, they may not
        know they're engaged, like during a sneak attack.
      </Typography.Paragraph>
      <Typography.Paragraph>
        To evade, treat evasion and pursuit as combat actions. No mapping while
        fleeing. Navigating obstacles may require a saving throw vs. Death Ray.
        Failing means falling and pausing until the next round.
      </Typography.Paragraph>
      <Typography.Paragraph>
        If pursuers get within 5', melee combat starts. Fleeing characters risk
        "parting shots." If they escape the pursuer's sight for a full round,
        they've evaded.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Turning your back on an adjacent, armed opponent allows them a "parting
        shot" with a +2 attack bonus. You can also back away at half speed while
        fighting, known as a fighting withdrawal. You still move first.
      </Typography.Paragraph>
    </>
  );
}
