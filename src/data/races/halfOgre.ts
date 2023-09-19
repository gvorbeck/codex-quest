import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const halfOgre: RaceSetup = {
  name: "Half-Ogre",
  allowedStandardClasses: [
    ClassNames.CLERIC,
    ClassNames.CUSTOM,
    ClassNames.DRUID,
    ClassNames.FIGHTER,
    ClassNames.BARBARIAN,
    ClassNames.PALADIN,
  ],
  minimumAbilityRequirements: { strength: 13, constitution: 13 },
  maximumAbilityRequirements: { intelligence: 15, wisdom: 15 },
  incrementHitDie: true,
  details: {
    description:
      "(Half Humans Release 5)\n\nHalf-ogres are the result of crossbreeding between humans and ogres. Such creatures tend to be outcasts within both human and ogrish communities, but they may often be found as leaders in communities of orcs or goblins. Half-ogres are big, averaging around 7 feet in height, broad-shouldered, and rangy. Their features tend to favor the ogrish parent, with dark coarse hair, tan or brown skin, and dark eyes.\n\n**Restrictions**: Half-ogres may become Clerics or Fighters only. A half-ogre must have a minimum of 13 in both Strength and Constitution, and may not have either Intelligence or Wisdom higher than 15.\n\n**Special Abilities**: Half-ogres roll hit dice one size larger than normal; so a half-ogre Fighter rolls d10's for hit points, while a half-ogre Cleric rolls d8's. Half-ogres gain a bonus of +5% on all earned experience. Due to their great size, they gain a bonus of +1 on the roll when opening doors or performing other feats of Strength. Finally, they have Darkvision with a 30 foot range.\n\n**Saving Throws**: Half-ogres gain no special bonuses to their saving throw rolls.",
    specials: [
      "**Half-ogres** roll hit dice one size larger than normal; so a half-ogre Fighter rolls d10's for hit points, while a half-ogre Cleric rolls d8's.",
      "**Half-ogres** gain a bonus of +5% on all earned experience.",
      "Due to their great size, **Half-ogres** gain a bonus of +1 on the roll when opening doors or performing other feats of Strength.",
      "**Half-ogres** have Darkvision with a 30 foot range.",
    ],
    restrictions: [],
  },
};
