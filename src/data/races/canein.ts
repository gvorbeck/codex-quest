import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const canein: RaceSetup = {
  name: "Canein",
  allowedStandardClasses: [...(Object.values(ClassNames) as ClassNames[])],
  minimumAbilityRequirements: { constitution: 9 },
  maximumAbilityRequirements: { intelligence: 17 },
  specialAbilitiesOverride: [
    [
      ClassNames.RANGER,
      {
        Tracking: "DEDUCT 20% to this roll",
      },
    ],
  ],
  savingThrows: {
    deathRayOrPoison: 2,
    paralysisOrPetrify: 2,
  },
  details: {
    description:
      "(New Races Release 2)\n\nA legend exists that there was a wizard who loved his dogs. This mage kept dogs as pets, trained them to guard his estate, and even used them in magical experiments to enhance their ability to serve. They were gifted with greater intelligence and a more humanoid stature. It is unknown whether the legend is entirely true or not, but it is generally assumed to be the genesis of the Caneins.\n\nCaneins are a race of dog-like humanoids, known for their extreme sense of loyalty whether to liege, friend, or family. There is a great deal of physical variance among the individual Caneins, with some short and stocky, others leanly-muscled, and variations in the colorations of their coats. However, all Caneins share a similar facial structure similar to the various bulldog or boxer-type dog breeds, having jowls and squat features. Caneins vary in their height, but are rarely larger than the average human. Caneins often form almost knight-like codes and attitudes, often serving a patron in exactly that capacity.\n\n**Restrictions**: Caneins can be any class, although they seldom become Thieves. Even when a Canein Thief is found, it typically uses the skills of that profession in more honorable ways than the typical rogue. A Canein must have a minimum Constitution of 9, and is limited to a maximum Intelligence of 17.\n\n**Special Abilities**: Caneins have a keen sense of smell, able to identify individuals by their scent alone. This  power olfactory sense allows the Canein to determine the presence of concealed or invisible creatures, and any penalties associated with combating such foes is halved for the Canein. For instance, a Canein suffers only a -2 penalty when attacking an invisible pixie. All Caneins can track as a Ranger of equivalent level, and an actual Canein Ranger (if the class is allowed by the GM) gets a bonus of +20% on Tracking rolls.\n\nCaneins have +2 on any reaction rolls involving other canine creatures. However, Caneins do not like vile beasts such as werewolves, hellhounds, and the like, despite any similarities.\n\n**Saving Throws**: Caneins save at +2 vs. Death Ray or Poison as well as vs. Paralysis and Petrification effects.",
    specials: [
      "**Caneins** have a keen sense of smell, able to identify individuals by their scent alone. This  power olfactory sense allows the Canein to determine the presence of concealed or invisible creatures, and any penalties associated with combating such foes is halved for the Canein.",
      "All **Caneins** can track as a Ranger of equivalent level, and an actual Canein Ranger (if the class is allowed by the GM) gets a bonus of +20% on Tracking rolls.",
      "**Caneins** have +2 on any reaction rolls involving other canine creatures.",
    ],
    restrictions: [],
  },
};
