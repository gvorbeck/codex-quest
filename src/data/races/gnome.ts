import { DiceTypes } from "../definitions";
import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const gnome: RaceSetup = {
  name: "Gnome",
  allowedStandardClasses: [
    ClassNames.CLERIC,
    ClassNames.CUSTOM,
    ClassNames.DRUID,
    ClassNames.FIGHTER,
    ClassNames.ILLUSIONIST,
    ClassNames.MAGICUSER,
    ClassNames.SPELLCRAFTER,
    ClassNames.THIEF,
    ClassNames.NECROMANCER,
    ClassNames.PALADIN,
  ],
  hasLowCapacity: true,
  allowedCombinationClasses: [ClassNames.MAGICUSER, ClassNames.THIEF],
  noLargeEquipment: true,
  minimumAbilityRequirements: { constitution: 9 },
  maximumAbilityRequirements: { strength: 17 },
  maximumHitDice: DiceTypes.D6,
  savingThrows: { deathRayOrPoison: 4, dragonBreath: 3 },
  details: {
    description:
      "(Gnomes Release 7)\n\nGnomes are small and stocky, more so than halflings but not as much as dwarves; both male and female gnomes stand around three and a half feet tall and typically weigh around 90 pounds. Their hair and beards may be blond, brown, black, or sometimes red. The most noticeable features about a gnome from the standpoint of other races is their pointed ears and noses. They are renowned for their rapidly-changing moods, sometimes gruff and contrary, sometimes whimsical and humorous. They have a lifespan between two and three centuries long.\n\n**Restrictions**: Gnomes may become Clerics, Fighters, Magic-Users, Thieves, or Magic-User/Thieves. They are required to have a minimum Constitution of 9. Due to their small stature, they may not have a Strength higher than 17. Gnomes never roll larger than six-sided dice (d6) for hit points regardless of class. They may not employ Large weapons more than four feet in length (specifically, two-handed swords, polearms, and longbows). With respect to encumbrance, treat gnomes as equivalent to halflings.\n\n**Special Abilities**: All gnomes have Darkvision with a 30-foot range. When attacked in melee by creatures larger than man-sized, gnomes gain a +1 bonus to their Armor Class.\n\nGnomes are naturally very observant; being smaller than most other races has made them cautious and aware of their surroundings. As a consequence, a gnome has a 10% chance to detect an invisible or hidden creature within a 30 foot radius. This ability does not apply to inanimate objects such as secret doors or invisible objects. A Thief hiding in shadows, an invisible sprite, or a character wearing an elven cloak may all be detected in this way. As with any detection ability, the GM should make this roll.\n\nA gnome who has detected a hidden Thief can see them dimly; truly invisible creatures are sensed by their breathing, by the way echoes change in their vicinity, and so on. When fighting an invisible opponent, a gnome who has successfully detected the invisible creature suffers only a -2 penalty on the attack roll, rather than the usual -4 penalty as given on page 59 of the Basic Fantasy RPG Core Rules.\n\n**Saving Throws**: Gnomes save at +4 vs. Death Ray or Poison, and at +3 vs. Dragon Breath.",
    specials: [
      "All **Gnomes** have Darkvision with a 30-foot range.",
      "When attacked in melee by creatures larger than man-sized, **Gnomes** gain a +1 bonus to their Armor Class.",
      "**Gnomes** are naturally very observant; being smaller than most other races has made them cautious and aware of their surroundings. As a consequence, a Gnome has a 10% chance to detect an invisible or hidden creature within a 30 foot radius. This ability does not apply to inanimate objects such as secret doors or invisible objects.",
      "When fighting an invisible opponent, a **Gnome** who has successfully detected the invisible creature suffers only a -2 penalty on the attack roll, rather than the usual -4 penalty as given.",
    ],
    restrictions: [
      "**Gnomes** may become Clerics, Fighters, Magic-Users, Thieves, or Magic-User/Thieves. They are required to have a minimum Constitution of 9.",
      "Due to their small stature, **Gnomes** may not have a Strength higher than 17.",
      "**Gnomes** never roll larger than six-sided dice (d6) for hit points regardless of class.",
      "**Gnomes** may not employ Large weapons.",
    ],
  },
};
