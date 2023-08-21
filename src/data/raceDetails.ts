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
  [RaceNames.GNOME]: {
    description: marked(
      `Gnomes are small and stocky, more so than halflings but not as much as dwarves; both male and female gnomes stand around three and a half feet tall and typically weigh around 90 pounds. The most noticeable features about a gnome from the standpoint of other races is their pointed ears and noses. They are renowned for their rapidly-changing moods, sometimes gruff and contrary, sometimes whimsical and humorous. They have a lifespan between two and three centuries long.`
    ),
    specials: [
      marked(
        `**Gnomes** are naturally very observant; being smaller than most other races has made them cautious and aware of their surroundings. As a consequence, a Gnome has a 10% chance to detect an invisible or hidden creature within a 30 foot radius. This ability does not apply to inanimate objects such as secret doors or invisible objects.`
      ),
      marked(
        `When fighting an invisible opponent, a **Gnome** who has successfully detected the invisible creature suffers only a -2 penalty on the attack roll, rather than the usual -4 penalty as given.`
      ),
    ],
    restrictions: [
      marked(
        `**Gnomes** may become Clerics, Fighters, Magic-Users, Thieves, or Magic-User/Thieves. They are required to have a minimum Constitution of 9.`
      ),
      marked(
        `Due to their small stature, **Gnomes** may not have a Strength higher than 17.`
      ),
      marked(
        `**Gnomes** never roll larger than six-sided dice (d6) for hit points regardless of class.`
      ),
      marked(`**Gnomes** may not employ Large weapons.`),
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
