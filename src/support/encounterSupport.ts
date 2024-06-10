import {
  EncounterDetails,
  EncounterEnvironment,
  Monster,
} from "@/data/definitions";
import monster from "@/data/monsters.json";
import { rollDice } from "./diceSupport";

export function getMonsterByName(name: string) {
  return monster.find((m) => m.name.includes(name));
}

export function getEncounter(
  environment: EncounterEnvironment,
  encounterDetails: EncounterDetails,
) {
  const encounterRoll = Math.floor(Math.random() * 6) + 1;
  if (encounterRoll > 1) {
    return "No encounter.";
  }
  const choices: Monster["name"][] = [];
  let monster;
  if (environment === "dungeon") {
    const roll = Math.floor(Math.random() * 12) + 1;
    const { level } = encounterDetails;
    switch (level) {
      case 1:
        choices.push(
          "Bee, Giant",
          "Goblin",
          "Jelly, Green*",
          "Kobold",
          "NPC Party: Adventurer",
          "NPC Party: Bandit",
          "Orc",
          "Stirge",
          "Skeleton",
          "Snake, Spitting Cobra",
          "Spider, Giant Crab",
          "Wolf",
        );
        break;
      case 2:
        choices.push(
          "Beetle, Giant Bombardier",
          "Fly, Giant",
          "Ghoul",
          "Gnoll",
          "Hobgoblin",
          "Jelly, Gray",
          "Lizard Man",
          "NPC Party: Adventurer",
          "NPC Party: Bandit",
          "Snake, Pit Viper",
          "Spider, Giant Black",
          "Lizard Man",
          "Zombie",
        );
        break;
      case 3:
        choices.push(
          "Ant, Giant",
          "Ape, Carnivorous",
          "Beetle, Giant Tiger",
          "Bugbear",
          "Doppleganger",
          "Gargoyle*",
          "Jelly, Glass",
          "Lycanthrope, Wererat*",
          "Ogre",
          "Shadow*",
          "Tentacle Worm",
          "Wight*",
        );
        break;
      case 4:
      case 5:
        choices.push(
          "Bear, Cave",
          "Caecilia, Giant",
          "Cockatrice",
          "Doppleganger",
          "Jelly, Gray",
          "Hellhound",
          "Rust Monster*",
          "Lycanthrope, Werewolf*",
          "Minotaur",
          "Jelly, Ochre*",
          "Owlbear",
          "Wraith*",
        );
        break;
      case 6:
      case 7:
        choices.push(
          "Basilisk",
          "Jelly, Black",
          "Caecilia, Giant",
          "Deceiver",
          "Hydra",
          "Rust Monster*",
          "Lycanthrope, Weretiger*",
          "Mummy*",
          "Owlbear",
          "Scorpion, Giant",
          "Spectre*",
          "Troll",
        );
        break;
      case 8:
      default:
        choices.push(
          "Basilisk",
          "Chimera",
          "Deceiver",
          "Giant, Hill",
          "Giant, Stone",
          "Hydra",
          "Jelly, Black",
          "Lycanthrope, Wereboar*",
          "Purple Worm",
          "Salamander, Flame*",
          "Salamander, Frost*",
          "Vampire*",
        );
        break;
    }
    monster = getMonsterByName(choices[roll - 1]);
  } else if (environment === "wilderness") {
    const roll = rollDice("2d8");
    const { subEnvironment } = encounterDetails;
    switch (subEnvironment) {
      case "desert-or-barren":
        choices.push(
          "Dragon, Desert",
          "Hellhound",
          "Giant, Fire",
          "Purple Worm",
          "Fly, Giant",
          "Scorpion, Giant",
          "Camel",
          "Spider, Giant Tarantula",
          "NPC Party: Merchant",
          "Hawk",
          "NPC Party: Bandit",
          "Ogre",
          "Griffon",
          "Gnoll",
          "Dragon, Mountain",
        );
        break;
      case "grassland":
        choices.push(
          "Dragon, Plains",
          "Troll",
          "Fly, Giant",
          "Scorpion, Giant",
          "NPC Party: Bandit",
          "Lion",
          "Boar",
          "NPC Party: Merchant",
          "Wolf",
          "Bee, Giant",
          "Gnoll",
          "Goblin",
          "Blink Dog",
          "Wolf, Dire",
          "Giant, Hill",
        );
        break;
      case "inhabited-territories":
        choices.push(
          "Dragon, Cloud",
          "Ghoul",
          "Bugbear",
          "Goblin",
          "Centaur",
          "NPC Party: Bandit",
          "NPC Party: Merchant",
          "NPC Party: Pilgrim",
          "NPC Party: Noble",
          "Dog",
          "Gargoyle*",
          "Gnoll",
          "Ogre",
          "Minotaur",
          "Vampire*",
        );
        break;
      case "jungle":
        choices.push(
          "Dragon, Forest",
          "NPC Party: Bandit",
          "Goblin",
          "Hobgoblin",
          "Centipede, Giant",
          "Snake, Giant Python",
          "Elephant",
          "Antelope",
          "Jaguar",
          "Stirge",
          "Beetle, Giant Tiger",
          "Caecilia, Giant",
          "Shadow*",
          "NPC Party: Merchant",
          "Wolf",
          "Lycanthrope, Weretiger*",
        );
        break;
      case "mountains-or-hills":
        choices.push(
          "Dragon, Ice",
          "Roc",
          "Deceiver",
          "Lycanthrope, Werewolf*",
          "Mountain Lion",
          "Wolf",
          "Spider, Giant Crab",
          "Hawk",
          "Orc",
          "Bat",
          "Hawk",
          "Giant, Hill",
          "Chimera",
          "Wolf",
          "Dragon, Mountain",
        );
        break;
      case "ocean":
        choices.push(
          "Dragon, Sea",
          "Hydra",
          "Whale, Sperm",
          "Crocodile",
          "Crab, Giant",
          "Whale, Killer",
          "Octopus, Giant",
          "Shark, Mako",
          "Shark, Bull",
          "NPC Party: Merchant",
          "NPC Party: Buccaneer",
          "Roc",
          "Shark, Great White",
          "Mermaid",
          "Sea Serpent",
        );
        break;
      case "river-or-riverside":
        choices.push(
          "Dragon, Swamp",
          "Fish, Giant Piranha",
          "Stirge",
          "Fish, Giant Bass",
          "NPC Party: Merchant",
          "Lizard Man",
          "Crocodile",
          "Frog, Giant",
          "Fish, Giant Catfish",
          "NPC Party: Buccaneer",
          "Troll",
          "Jaguar",
          "Nixie",
          "Water Termite, Giant",
          "Dragon, Forest",
        );
        break;
      case "swamp":
        choices.push(
          "Dragon, Swamp",
          "Shadow*",
          "Troll",
          "Lizard, Giant Draco",
          "Centipede, Giant",
          "Leech, Giant",
          "Lizard Man",
          "Crocodile",
          "Stirge",
          "Orc",
          "Frog, Giant (and Toad, Giant)",
          "Lizard Man",
          "Blood Rose",
          "Hangman Tree",
          "Basilisk",
        );
        break;
      case "woods-or-forest":
        choices.push(
          "Dragon, Forest",
          "Unicorn (and Alicorn)",
          "Treant",
          "Orc",
          "Boar",
          "Bear, Black",
          "Hawk",
          "Antelope",
          "Wolf",
          "Ogre",
          "Bear, Grizzly",
          "Wolf",
          "Giant, Hill",
          "Owlbear",
          "Unicorn",
        );
        break;
    }
    monster = getMonsterByName(choices[roll - 2]);
  } else if (environment === "urban") {
    const roll = rollDice("2d6");
    const { time } = encounterDetails;
    if (time === "day") {
      choices.push(
        "Doppleganger - City Encounter",
        "Noble",
        "Thief",
        "Bully",
        "City Watch",
        "Merchant",
        "Beggar",
        "Priest",
        "Mercenary",
        "Wizard",
        "Lycanthrope, Wererat* - City Encounter",
      );
    }
    if (time === "night") {
      choices.push(
        "Doppleganger - City Encounter",
        "Shadow*",
        "Press Gang",
        "Beggar",
        "Thief",
        "Bully",
        "Merchant",
        "Giant Rat - City Encounter",
        "City Watch",
        "Wizard",
        "Lycanthrope, Wererat* - City Encounter",
      );
    }
    monster = getMonsterByName(choices[roll - 2]);
  } else {
    throw new Error("Invalid environment");
  }

  if (!monster) {
    console.log(monster);
    throw new Error("Invalid monster");
  }
  return monster;
}
