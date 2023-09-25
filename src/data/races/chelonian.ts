import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const chelonian: RaceSetup = {
  name: "Chelonian",
  allowedStandardClasses: [...(Object.values(ClassNames) as ClassNames[])],
  minimumAbilityRequirements: { constitution: 11 },
  maximumAbilityRequirements: { dexterity: 17 },
  savingThrows: {
    deathRayOrPoison: 2,
  },
  altBaseAC: 13,
  details: {
    description:
      "(New Races Release 2)\n\nInhabiting river and lake regions, Chelonian are a race of reptilian humanoids bearing some semblance to turtles. They are normally content to remain within their own societies, but on occasion a more adventurous individual can be found. They are protected by thick scaly skin as well as a shell-like growth that covers their backside. Chelonian are seldom taller than 5’ or so.\n\n**Restrictions**: Chelonian may become members of any class. A Chelonian must have a minimum Constitution score of 11, and is limited to a maximum Dexterity score of 17.\n\nNormal armors will not fit the physique of a Chelonian and they normally use only shields to enhance their defenses. Specially-constructed armors can be acquired, costing substantially more than listed prices and requiring extra time to create.\n\n**Special Abilities**: A Chelonian's thick skin grants it a base AC of 13 (equivalent to leather armor), and a Chelonian's back is especially tough with an AC of 17 (equivalent to plate mail only for rear attacks). Use these figures unless any armor worn grants better AC, then use the armor’s AC. A shield will be still effective in either case.\n\nChelonian swim no better than other humanoid races, but they can hold their breath twice as long. In addition, their underwater vision is also twice as good as normal.\n\n**Saving Throws**: Chelonian save at +2 vs. Poison.",
    specials: [
      "A **Chelonian's** thick skin grants it a base AC of 13 (equivalent to leather armor), and a Chelonian's back is especially tough with an AC of 17 (equivalent to plate mail only for rear attacks).",
      "**Chelonian** swim no better than other humanoid races, but they can hold their breath twice as long. In addition, their underwater vision is also twice as good as normal.",
    ],
    restrictions: [
      "Normal armors will not fit the physique of a **Chelonian** and they normally use only shields to enhance their defenses. Specially-constructed armors can be acquired, costing substantially more than listed prices and requiring extra time to create.",
    ],
  },
};
