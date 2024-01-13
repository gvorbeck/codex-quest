import { AttackTypes } from "@/support/stringSupport";
import { ClassNames } from "@/data/definitions";
import { RaceSetup } from "./definitions";

// TODO: Add Details (specials, restrictions)
// TODO: Thief/Assassin Ability Adjustments
export const bisren: RaceSetup = {
  name: "Bisren",
  allowedStandardClasses: [
    ClassNames.CLERIC,
    ClassNames.CUSTOM,
    ClassNames.DRUID,
    ClassNames.FIGHTER,
    ClassNames.THIEF,
    ClassNames.RANGER,
    ClassNames.PALADIN,
  ],
  minimumAbilityRequirements: { strength: 11, constitution: 11 },
  maximumAbilityRequirements: { dexterity: 17, intelligence: 17 },
  incrementHitDie: true,
  uniqueAttacks: [
    {
      name: "Gore",
      costValue: 0,
      costCurrency: "gp",
      category: "inherent",
      damage: "1d6",
      amount: 1,
      type: AttackTypes.MELEE,
      noDelete: true,
    },
  ],
  specialAbilitiesOverride: [
    [
      ClassNames.THIEF,
      {
        "Open Locks": "ADD 10% to this roll",
        "Remove Traps":
          "ADD 10% to this roll IF INDOORS, DEDUCT 20% IF OUTDOORS",
        "Pick Pockets": "ADD 10% to this roll",
        "Move Silently": "ADD 20% to this roll if IN DOORS/URBAN SETTING",
      },
    ],
  ],
  details: {
    description:
      "(New Races Release 2)\n\nThe Bisren are a race descended from the great Minotaurs of legend. Normally peaceful, Bisren enjoy nature and keep a semi-nomadic lifestyle in regions that other races call wild. When threatened, Bisren can become quite dangerous, much like their warrior ancestors. Bisren are impressively muscled and generally average 7’ tall, with some individuals reaching almost 8’ in height.\n\n**Restrictions**: Bisren prefer professions associated with their nature-oriented lifestyles and may become Fighters or Clerics (often choosing Ranger or Druid if those optional classes are available). While it is rare to find a Bisren Thief, they are not barred from the class (although they do suffer several penalties to roguish abilities). A Bisren character must have minimum Strength and Constitution scores of 11. Not particularly bright or dexterous, Bisren are limited to 17 in both Dexterity and Intelligence. Bisren may wear human-sized armor, albeit often adjusted slightly to account for their size. Their cloven-hoof feet may not wear typical footwear, unless specially produced for Bisren. Specially-constructed helmets are likewise needed to fit their horned heads.\n\n**Special Abilities**: Bisren roll hit dice one size larger than normal; a d4 would become a d6, a d6 to d8, etc. Bisren are never truly unarmed, as they can gore for 1d6 damage with their horns. Bisren often charge into battle with a gore attack (+2 to hit with double damage, following all normal charging rules) and then switch to weaponry for the remainder of the fight. They must choose whether to attack with weapons or to gore; they cannot do both in a round. Bisren get an additional +1 bonus on feats of strength such as opening doors due to their great size.\n\n**Thief Ability Adjustments**: Roguish Bisren have a -10% penalty to Open Locks, Removing Traps, and Picking Pockets. Stealth checks (Moving Silently and Hiding) for Bisren are made normally, although in non-wilderness areas such as indoors, underground (dungeons), or in urban areas they suffer a -20% penalty to their chance to succeed. Outdoor traps, such as hunting snares or deadfalls, do not apply the above penalty and instead are made at +10% bonus.\n\n**Saving Throws**: Bisren gain no special bonuses to their saving throw rolls.",
    specials: [
      "**Bisren** are never truly unarmed, as they can gore for 1d6 damage with their horns. Bisren often charge into battle with a gore attack (+2 to hit with double damage, following all normal charging rules) and then switch to weaponry for the remainder of the fight. They must choose whether to attack with weapons or to gore; they cannot do both in a round.",
      "**Bisren** get an additional +1 bonus on feats of strength such as opening doors due to their great size.",
    ],
    restrictions: [
      "Due to their size, **Bisren** suffer several penalties to roguish abilities as Thiefs.",
      "**Bisren** may wear human-sized armor, albeit often adjusted slightly to account for their size. Their cloven-hoof feet may not wear typical footwear, unless specially produced for Bisren. Specially-constructed helmets are likewise needed to fit their horned heads.",
    ],
  },
};
