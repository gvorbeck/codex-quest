import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const chelonian: RaceSetup = {
  name: "Chelonian",
  allowedStandardClasses: [...(Object.values(ClassNames) as ClassNames[])],
  minimumAbilityRequirements: { constitution: 11 },
  maximumAbilityRequirements: { dexterity: 17 },
  altBaseAC: 13,
  details: {
    description: "",
    specials: [],
    restrictions: [],
  },
};
