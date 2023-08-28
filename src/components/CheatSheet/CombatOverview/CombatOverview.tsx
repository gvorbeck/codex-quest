import { List, Typography } from "antd";

export default function CombatOverview() {
  return (
    <>
      <List
        size="small"
        dataSource={[
          "Check for Surprise (GM)",
          "Check monster reaction (GM)",
          "Combat cycle",
        ]}
        renderItem={(item, index) => (
          <List.Item>
            {index + 1}. {item}
          </List.Item>
        )}
      />
      <Typography.Title level={4}>Combat Cycle</Typography.Title>
      <Typography.Paragraph>
        <strong>Roll Initiative</strong>. Roll 1d6 and add any bonuses or
        penalties, including DEX bonus, -1 if deafened, and -2 if blinded.
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Act in descending initiative order</strong>. Characters who have
        the same initiative number act simultaneously. A character can delay
        their action until another character acts, acting simultaneously with
        them.
      </Typography.Paragraph>
      <Typography.Paragraph>
        On their turn, individuals may move and then attack (in that order),
        just move, or just attack. An attack ends the character's turn. In
        combat, casting a spell usually takes the same time as making an attack.
        If a spellcaster is attacked on the Initiative number on which they are
        casting a spell, the spell is spoiled and lost.
      </Typography.Paragraph>
    </>
  );
}
