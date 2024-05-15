import { ClassNames, DiceTypes } from "../definitions";
import { RaceSetup } from "./definitions";
import { iconStrings } from "@/support/stringSupport";
import DarkvisionSvg from "@/assets/svg/DarkVisionSvg";
import SecretDoorsSvg from "@/assets/svg/SecretDoorsSvg";
import ParalyzingAttackSvg from "@/assets/svg/ParalyzingAttackSvg";
import NoSurpriseSvg from "@/assets/svg/NoSurpriseSvg";
import SunlightSensitivitySvg from "@/assets/svg/SunlightSensitivitySvg";

export const dokkalfar: RaceSetup = {
  name: "Dokkalfar",
  allowedStandardClasses: [
    ClassNames.CLERIC,
    ClassNames.FIGHTER,
    ClassNames.MAGICUSER,
    ClassNames.THIEF,
  ],
  allowedCombinationClasses: [
    ClassNames.FIGHTER,
    ClassNames.MAGICUSER,
    ClassNames.THIEF,
  ],
  minimumAbilityRequirements: { intelligence: 9 },
  maximumAbilityRequirements: { constitution: 17 },
  maximumHitDice: DiceTypes.D6,
  savingThrows: {
    deathRayOrPoison: 2,
    magicWands: 2,
    spells: 2,
  },
  details: {
    description:
      "(Dokkalfar Release 1)\n\nDokkalfar are a subspecies of Elves, but they believe themselves far superior to any and all other types. Both males and females stand around five feet tall and weight around 130 pounds. Most have hair of monochromatic coloration ranging from jet black to pure white, and lack almost all body and facial hair. Their skin is a very pale white, and they have pointed ears and delicate features in common with other elven types. Their eyes are perhaps their most striking feature, being some very pale shade of blue, green, or grey, with the latter being the most common coloration. \n\nDokkalfar are typically haughty, cold-blooded, resentful, and lack empathy towards other races as they see them as completely inferior. Their negative attitude is strongest against all surface dwelling races, most especially Elves. Their typical lifespan is a dozen centuries or more.\n\nThey speak a dialect of Elvish which will be difficult for other Elves to understand. Some may learn other languages, but generally only those useful to them, such as Dragon or Hobgoblin. They will rarely if ever speak Common; however, if the GM chooses to allow them as player characters, beginning Dokkalfar PCs may choose to speak both Common and their Elvish dialect.\n\n**Restrictions**: Dokkalfar are a subspecies of Elves, but they believe themselves far superior to any and all other types. Both males and females stand around five feet tall and weight around 130 pounds. Most have hair of monochromatic coloration ranging from jet black to pure white, and lack almost all body and facial hair. Their skin is a very pale white, and they have pointed ears and delicate features in common with other elven types. Their eyes are perhaps their most striking feature, being some very pale shade of blue, green, or grey, with the latter being the most common coloration. Dokkalfar are typically haughty, cold-blooded, resentful, and lack empathy towards other races as they see them as completely inferior. Their negative attitude is strongest against all surface dwelling races, most especially Elves. Their typical lifespan is a dozen centuries or more. They speak a dialect of Elvish which will be difficult for other Elves to understand. Some may learn other languages, but generally only those useful to them, such as Dragon or Hobgoblin. They will rarely if ever speak Common; however, if the GM chooses to allow them as player characters, beginning Dokkalfar PCs may choose to speak both Common and their Elvish dialect.\n\n**Special Abilities**: All Dokkalfar have superior Darkvision with a 120' range. They are able to find secret doors more often than normal (1-2 on 1d6 rather than the usual 1 on 1d6). A Dokkalf is so observant that one has a 1 on 1d6 chance to find a secret door with a cursory look. Dokkalfar are immune to the paralyzing attack of ghouls. They are less likely to be surprised in combat, reducing the chance of surprise by 1 in 1d6.\n\n**Saving Throws**: Dokkalfar save at +2 vs. Poison and +2 vs. Magic Wands and Spells.\n\n**Additional Notes**: To resist the effects of sunlight, Dokkalfar war or raiding parties have been known to coat their exposed skin with a black ointment. This ointment prevents all damage from sunlight exposure for protected areas, and can only be removed with alcohol solutions (beer is not strong enough, but wine or mead will do the trick). The ointment does lose effectiveness in 1d4 days, though it remains visible on the skin (becoming lighter by the day) for twice the rolled period. Use of this ointment has resulted in many not totally familiar with them to believe that they actually have black skin. This ointment provides no protection against anything other than sunlight and is thus not useful to most other creatures; further, the recipe requires substances found only in the caves and strongholds of the Dokkalfar.",
    specials: [
      "All **Dokkalfar** have superior Darkvision with a 120' range.",
      "**Dokkalfar** are able to find secret doors more often than normal (1-2 on 1d6 rather than the usual 1 on 1d6).",
      "A **Dokkalf** is so observant that one has a 1 on 1d6 chance to find a secret door with a cursory look.",
      "**Dokkalfar** are immune to the paralyzing attack of ghouls.",
      "**Dokkalfar** are less likely to be surprised in combat, reducing the chance of surprise by 1 in 1d6.",
    ],
    restrictions: [
      "**Dokkalfar** are extremely sensitive to light; if suddenly exposed to daylight or any illumination of similar brightness they must save vs. Death Ray or suffer blindness for 2d4 rounds.  Even so, when in such illumination they suffer a -2 penalty to all attack rolls.  Exposure of a Dokkalf's skin to actual daylight (not merely bright lights) causes their skin to actually harden and begin to crack, inflicting 1d4 points of damage per each full turn of exposure.",
    ],
  },
  icons: [
    [DarkvisionSvg, iconStrings.darkVision(120)],
    [
      SecretDoorsSvg,
      iconStrings.secretDoors(
        "1-2",
        "1d6, or even a 1 on 1d6 with a cursory look",
      ),
    ],
    [ParalyzingAttackSvg, iconStrings.paralyzingAttack],
    [NoSurpriseSvg, iconStrings.noSurprise("1", "1d6")],
    [
      SunlightSensitivitySvg,
      iconStrings.sunlightSensitivity(
        "If suddenly exposed to bright illumination they must save vs. Death Ray or suffer blindness for 2d4 rounds.  Even so, they suffer a -2 penalty to all attack rolls.  Exposure of skin to daylight causes skin to actually harden and crack, inflicting 1d4 points of damage per each full turn.",
      ),
    ],
  ],
};
