import { Typography } from "antd";

export default function MagicUsersSpells() {
  return (
    <>
      <Typography.Paragraph>
        Magic-Users may learn spells by being taught directly by another
        Magic-User, or by studying another MagicUser's spellbook. If being
        taught, a spell can be learned in a single day; researching another
        Magic-User's spellbook takes one day per spell level. Either way, the
        spell learned must be transcribed into the Magic-User's own spellbook,
        at a cost of 500 gp per spell level transcribed. A beginning Magic-User
        starts with a spellbook containing read magic and at least one other
        first-level spell, as determined by the GM, at no cost.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Each day, usually in the morning, Magic-Users must study their
        spellbooks to prepare spells to replace those they have used. Spells
        prepared but not used persist from day to day; only those actually cast
        must be replaced. A spellcaster may always choose to dismiss a prepared
        spell (without casting it) in order to prepare a different spell of that
        level.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Spellcasters must have at least one hand free, and be able to speak, in
        order to cast spells; thus, binding and gagging a spellcaster is an
        effective means of preventing them from casting spells. In combat,
        casting a spell usually takes the same time as making an attack. If a
        spell caster is attacked (even if not hit) or must make a saving throw
        (whether successful or not) on the Initiative number on which they are
        casting a spell, the spell is spoiled and lost. As a specific exception,
        two spell casters releasing their spells at each other on the same
        Initiative number will both succeed in their casting; one caster may
        disrupt another with a spell only if they have a better Initiative, and
        chooses to delay casting the spell until right before the other caster.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Some spells are reversible; such spells are shown with an asterisk (*)
        after the name.
      </Typography.Paragraph>
    </>
  );
}
