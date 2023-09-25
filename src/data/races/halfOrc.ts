import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const halfOrc: RaceSetup = {
  name: "Half-Orc",
  allowedStandardClasses: [...(Object.values(ClassNames) as ClassNames[])],
  minimumAbilityRequirements: { constitution: 9 },
  maximumAbilityRequirements: { intelligence: 17 },
  savingThrows: { deathRayOrPoison: 1 },
  details: {
    description:
      "(Half Humans Release 5)\n\nHalf-orcs are the result of crossbreeding between humans and orcs. Such creatures tend to be outcasts within Human communities, but sometimes rise to positions of leadership within orcish communities. Half-orcs are a bit shorter than humans. Their features tend to favor the orcish parent.\n\n**Restrictions**: Half-orcs may become members of any class. A half-orc must have a minimum Constitution of 9, and are limited to a maximum Intelligence of 17.\n\n**Special Abilities**: Half-orcs gain a bonus of +5% on all earned experience. They have Darkvision with a 60 foot range. When dealing with humanoids of human-size or smaller, a half-orc gains an additional +1 on any reaction die roll, in addition to their Charisma bonus.\n\n**Saving Throws**: Half-orcs save at +1 vs. Death Ray or Poison.",
    specials: [
      "**Half-orcs** gain a bonus of +5% on all earned experience.",
      "**Half-orcs** have Darkvision with a 60 foot range.",
      "When dealing with humanoids of human-size or smaller, a **Half-orc** gains an additional +1 on any reaction die roll, in addition to their Charisma bonus.",
    ],
    restrictions: [],
  },
};
