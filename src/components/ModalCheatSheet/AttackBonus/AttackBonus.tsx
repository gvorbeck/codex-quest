import { Descriptions } from "antd";

export default function AttackBonus() {
  return (
    <Descriptions bordered size="small" column={1}>
      <Descriptions.Item
        label="Attacking
From Behind"
      >
        +2 (do not combine with the Sneak Attack ability)
      </Descriptions.Item>
      <Descriptions.Item
        label="Flat of the
blade attack"
      >
        -4 (do half subduing damage)
      </Descriptions.Item>
      <Descriptions.Item label="Punch">
        +0 (1d3 points subduing damage)
      </Descriptions.Item>
      <Descriptions.Item label="Kick">
        -2 (1d4 points subduing damage)
      </Descriptions.Item>
      <Descriptions.Item
        label="Attacker/Defender
is invisible "
      >
        +4 / -4
      </Descriptions.Item>
      <Descriptions.Item
        label="Attacker/Defender
is blinded "
      >
        -4 / +4
      </Descriptions.Item>
      <Descriptions.Item
        label="Defender
is pinned"
      >
        +4
      </Descriptions.Item>
    </Descriptions>
  );
}
