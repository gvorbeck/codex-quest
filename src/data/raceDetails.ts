import { marked } from "marked";
import { RaceNames } from "../components/definitions";

export const raceDetails: Record<
  string,
  { description: string; specials: string[]; restrictions: string[] }
> = {
  [RaceNames.DWARF]: {
    description: marked(
      `Dwarves are a short, stocky race; both male and female Dwarves stand around four feet tall and typically weigh around 120 pounds. Their long hair and thick beards are dark brown, gray or black. They take great pride in their beards, sometimes braiding or forking them. Dwarves have stout frames and a strong, muscular build. They are rugged and resilient, with the capacity to endure great hardships. Dwarves are typically practical, stubborn and courageous. They can also be introspective, suspicious and possessive. They have a lifespan of three to four centuries.`
    ),
    restrictions: [
      marked(
        `**Dwarves** may not employ Large weapons more than four feet in length.`
      ),
    ],
    specials: [
      marked(`All **Dwarves** have Darkvision with a 60' range.`),
      marked(
        `**Dwarves** are able to detect slanting passages, stonework traps, shifting walls and new construction on a roll of 1-2 on 1d6; a search must be performed before this roll may be made.`
      ),
    ],
  },
  [RaceNames.ELF]: {
    description: marked(
      `Elves are a slender race, with both males and females standing around five feet tall and weighing around 130 pounds. Most have dark hair, with little or no body or facial hair. Thhey have pointed ears and delicate features. Elves are lithe and graceful. They have keen eyesight and hearing. Elves are typically inquisitive, passionate, self-assured, and sometimes haughty. Their typical lifespan is a dozen centuries or more.`
    ),
    restrictions: [],
    specials: [
      marked(`All **Elves** have Darkvision with a 60' range.`),
      marked(
        `**Elves** are able to find secret doors more often than normal (1-2 on 1d6 rather than the usual 1 on 1d6.`
      ),
      marked(
        `An **Elf** is so observant that one has a 1 on 1d6 chance to find a secret door with a cursory look.`
      ),
      marked(`**Elves** are immune to the paralyzing attack of ghouls.`),
      marked(
        `**Elves** are less likely to be surprised in combat, reducing the chance of surprise by 1 in 1d6.`
      ),
    ],
  },
  [RaceNames.HALFLING]: {
    description: marked(
      `Halflings are small, slightly stocky folk who stand around three feet tall and weigh about 60 pounds. They have curly hair on their heads and feet, but rarely have facial hair. Halflings are remarkably rugged for their small size. They are dexterous and nimble, capable of moving quietly and remaining very still. They usually go barefoot. Halflings are typically outgoing, unassuming and goodnatured. They live about a hundred years.`
    ),
    restrictions: [
      marked(
        `**Halflings** may not use Large weapons, and must wield Medium weapons with both hands.`
      ),
    ],
    specials: [
      marked(
        `**Halflings** are unusually accurate with all sorts of ranged weapons, gaining a +1 attack bonus when employing them.`
      ),
      marked(
        `When attacked in melee by creatures larger than man-sized, **Halflings** gain a +2 bonus to their Armor Class.`
      ),
      marked(
        `**Halflings** are quick-witted, adding +1 to Initiative die rolls.`
      ),
      marked(
        `In their preferred forest terrain, **Halflings** are able to hide very effectively; so long as they remain still there is only a 10% chance they will be detected. Even indoors, in dungeons or in non- preferred terrain they are able to hide such that there is only a 30% chance of detection. Note that a **Halfling Thief** will roll only once, using either the **Thief** ability or the **Halfling** ability, whichever is better.`
      ),
    ],
  },
  [RaceNames.HUMAN]: {
    description: marked(
      `Humans come in a broad variety of shapes and sizes. An average Human male in stands around six feet tall and weighs about 175 pounds, while females average five feet nine inches and weigh around 145 pounds. Most Humans live around 75 years.`
    ),
    restrictions: [],
    specials: [
      marked(
        `**Humans** learn unusually quickly, gaining a bonus of 10% to all experience points earned.`
      ),
    ],
  },
};
