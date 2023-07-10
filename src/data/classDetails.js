export const classChoices = [
  "Assassin",
  "Cleric",
  "Fighter",
  "Magic-User",
  "Thief",
  "Custom",
];
export const classDetails = {
  assassin: {
    specials: [
      "Assassins have several special abilities (see table). Some abilities are shared with the Thief class, and are described in the Core Rules.",
      "Poison: Assassins learn the art of making lethal poisons. Poisons are often quite expensive to make; it is not uncommon for a single application of contact poison to cost 500 gp or more. The GM is advised to take care that poison does not become too much of an easy solution for the Assassin.",
      "Assassinate: This is the Assassin's primary special ability. As with the Thief's Sneak Attack ability, any time an Assassin is behind an opponent in melee and it is reasonably likely the opponent doesn't know he or she is there, an attempt to assassinate may be made. The attack must be carried out with a one-handed piercing weapon, such as a dagger or sword. The attack is rolled at an attack bonus of +4, and if the attack hits, the victim must roll a saving throw vs. Death Ray or be instantly killed. If this saving throw is a success, the victim still suffers normal weapon damage. At the GM's option, characters two or more levels lower than the Assassin may be denied a saving throw.",
      "Waylay: An Assassin can attempt to knock out an opponent in a single strike. This is performed in much the same way as the Assassinate ability, but the Assassin must be using a weapon that does subduing damage normally (i.e. a club or cudgel). The attack is rolled at a +4 attack bonus; if the Assassin hits, the victim must make a saving throw vs. Death Ray or be knocked unconscious. If this roll is made, the victim still suffers normal subduing damage. Creatures knocked unconscious by a Waylay attack will remain that way for 2d8 turns if not awakened. Note that bounty hunters are often Assassins, who use the Waylay ability in the course of their (more or less) lawful activities.",
    ],
    restrictions: [
      "Assassins may use any weapon, but may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort",
    ],
  },
  cleric: {
    specials: [
      "Clerics can cast spells of divine nature starting at 2nd level",
      "Clerics have the power to Turn the Undead",
    ],
    restrictions: [
      "Clerics may wear any armor, but may only use blunt weapons (specifically including warhammer, mace, maul, club, quarterstaff, and sling)",
    ],
  },
  fighter: {
    specials: [
      "Although they are not skilled in the ways of magic, Fighters can nonetheless use many magic items, including but not limited to magical weapons and armor",
    ],
    restrictions: [],
  },
  "magic-user": {
    specials: [
      "Magic-User begins play knowing read magic and one other spell of first level",
    ],
    restrictions: [
      "The only weapons Magic-Users become proficient with are the dagger and the walking staff (or cudgel)",
      "Magic-Users may not wear armor of any sort nor use a shield as such things interfere with spellcasting",
    ],
  },
  thief: {
    specials: ["Thieves have a number of special abilities (see table)"],
    restrictions: [
      "Thieves may use any weapon, but may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort",
    ],
  },
};
