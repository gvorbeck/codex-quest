import { Typography } from "antd";

export default function Healing() {
  return (
    <>
      <Typography.Paragraph>
        Anyone reduced to zero hit points is (probably) dead. At the GM's
        discretion, it is possible that a high-level Cleric could raise the
        character from the dead, if the character's friends are willing to haul
        the body to one, and if the Cleric is willing. Often a hefty fee or some
        form of service will be required.
      </Typography.Paragraph>
      <Typography.Paragraph>
        If a character who has taken at least some subduing damage is reduced to
        zero hit points, the character becomes unconscious rather than dying.
        (Any further subduing damage is then considered killing damage, allowing
        the possibility that someone might be beaten to death.) A character
        knocked out in this way, but not subsequently killed, will wake up with
        1 hit point in 1d4 turns, or can be awakened (with 1 hit point) by
        someone else after 2d10 rounds.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Wounded characters recover 1 hit point of damage every day, provided
        that normal sleep (6 hours per day, plus / minus Constitution bonus) is
        possible. Characters who choose full bed rest regain an additional hit
        point each evening.
      </Typography.Paragraph>
    </>
  );
}
