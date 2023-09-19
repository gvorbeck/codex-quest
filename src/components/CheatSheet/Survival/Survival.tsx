import { Typography } from "antd";

export default function Survival() {
  return (
    <>
      <Typography.Paragraph>
        Normal characters must consume one day's worth of rations (or equivalent
        food) and a minimum of one quart of water per day. Failure to consume
        enough food does not significantly affect a character for the first two
        days, but after that they lose 1 hit point per day. Furthermore, at that
        point the character loses the ability to heal wounds normally, though
        magic will still work. Eating enough food for a day (over the course of
        about a day, not all at once) restores the ability to heal, and the
        character will recover lost hit points at the normal rate.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Inadequate water affects characters more swiftly; after a single day
        without water, the character loses 1d4 hit points, and will lose an
        additional 1d4 hit points per day thereafter. Healing ability is lost
        when the first die of damage is rolled.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Normal characters require 6 hours sleep out of every 24. Subtract from
        this the character's Constitution bonus; so a character with 18
        Constitution needs only 3 hours sleep per night (and a character with 3
        Constitution needs 9 hours). These figures are minimums; most characters
        would prefer to sleep two or more hours longer.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Characters who get less than the required amount of sleep suffer a -1
        penalty on all attack rolls and saving throws (as well as not healing
        any hit points). For each additional night where sufficient sleep is not
        received, the penalty becomes one point worse. Regardless of how long
        the character has gone without adequate sleep, the normal amount of
        sleep will remove these penalties.
      </Typography.Paragraph>
    </>
  );
}
