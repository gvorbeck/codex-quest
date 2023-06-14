export const raceDetails = {
  dwarf: {
    restrictions: [
      "Dwarves may not employ Large weapons more than four feet in length",
    ],
    specials: [
      "All Dwarves have Darkvision with a 60' range",
      "Dwarves are able to detect slanting passages, stonework traps, shifting walls and new construction on a roll of 1-2 on 1d6; a search must be performed before this roll may be made",
    ],
  },
  elf: {
    restrictions: [],
    specials: [
      "All Elves have Darkvision with a 60' range",
      "Elves are able to find secret doors more often than normal (1-2 on 1d6 rather than the usual 1 on 1d6)",
      "An Elf is so observant that one has a 1 on 1d6 chance to find a secret door with a cursory look",
      "Elves are immune to the paralyzing attack of ghouls",
      "Elves are less likely to be surprised in combat, reducing the chance of surprise by 1 in 1d6",
    ],
  },
  halfling: {
    restrictions: [
      "Halflings may not use Large weapons, and must wield Medium weapons with both hands",
    ],
    specials: [
      "Halflings are unusually accurate with all sorts of ranged weapons, gaining a +1 attack bonus when employing them",
      "When attacked in melee by creatures larger than man-sized, Halflings gain a +2 bonus to their Armor Class",
      "Halflings are quick-witted, adding +1 to Initiative die rolls",
      "In their preferred forest terrain, they are able to hide very effectively; so long as they remain still there is only a 10% chance they will be detected. Even indoors, in dungeons or in non- preferred terrain they are able to hide such that there is only a 30% chance of detection. Note that a Halfling Thief will roll only once, using either the Thief ability or the Halfling ability, whichever is better.",
    ],
  },
  human: {
    restrictions: [],
    specials: [
      "Humans learn unusually quickly, gaining a bonus of 10% to all experience points earned",
    ],
  },
};
