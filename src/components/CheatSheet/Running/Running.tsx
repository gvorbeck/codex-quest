import { Typography } from "antd";

export default function Running() {
  return (
    <Typography.Paragraph>
      A running character is not normally allowed to attack (except Charging).
      Running characters can move at double their normal encounter movement rate
      for a maximum number of rounds equal to 2 times the character's
      Constitution, after which they are exhausted and may only walk (at the
      normal encounter rate). For monsters without a given Constitution, allow
      the monster to run for 24 rounds. Exhausted characters or creatures must
      rest for at least a turn before running again.
    </Typography.Paragraph>
  );
}
