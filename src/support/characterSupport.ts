import {
  Abilities,
  CharData,
  ClassNames,
  EquipmentItem,
} from "@/data/definitions";
import { calculateModifier, rollDice } from "./diceSupport";
import { classes } from "@/data/classes";
import { getItemCost } from "./equipmentSupport";

export const openInNewTab = (url: string) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const emptyCharacter: CharData = {
  abilities: {
    scores: {
      strength: 0,
      intelligence: 0,
      wisdom: 0,
      dexterity: 0,
      constitution: 0,
      charisma: 0,
    },
    modifiers: {
      strength: "",
      intelligence: "",
      wisdom: "",
      dexterity: "",
      constitution: "",
      charisma: "",
    },
  },
  avatar: "",
  class: [],
  copper: 0,
  desc: [],
  electrum: 0,
  equipment: [],
  gold: 0,
  hp: {
    dice: "",
    points: 0,
    max: 0,
    desc: "",
  },
  level: 1,
  name: "",
  platinum: 0,
  race: "",
  silver: 0,
  spells: [],
  useCoinWeight: true,
  weight: 0,
  xp: 0,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function characterReducer(state: CharData, action: any): CharData {
  switch (action.type) {
    case "FETCH":
      return {
        ...(action.payload as CharData),
      };
    case "UPDATE":
      return {
        ...state,
        ...(action.payload as CharData),
      };
    case "RESET":
      // Return character to empty state.
      return emptyCharacter;
    case "SET_ABILITIES":
      // Set the character's abilities and modifiers.
      // If newCharacter is true, reset the character's future choices.
      return {
        ...state,
        abilities: {
          scores: action.payload.scores,
          modifiers: action.payload.modifiers,
        },
        race: action.payload.newCharacter ? "" : state.race,
        class: action.payload.newCharacter ? [] : [...state.class],
        hp: action.payload.newCharacter
          ? { dice: "", points: 0, max: 0, desc: "" }
          : { ...state.hp },
        equipment: [],
        gold: 0,
        spells: [],
      };
    case "FLIP_ABILITIES": {
      // Flip all the character's abilities and modifiers.
      // If newCharacter is true, reset the character's future choices.
      const flippedScores = Object.fromEntries(
        Object.entries(state.abilities.scores).map(([key, value]) => [
          key,
          21 - +value,
        ]),
      );
      const flippedModifiers = Object.fromEntries(
        Object.entries(flippedScores).map(([key, value]) => [
          key,
          calculateModifier(value),
        ]),
      );
      return {
        ...state,
        abilities: {
          scores: flippedScores as Abilities,
          modifiers: flippedModifiers as Abilities,
        },
        race: action.payload.newCharacter ? "" : state.race,
        class: action.payload.newCharacter ? [] : [...state.class],
        hp: action.payload.newCharacter
          ? { dice: "", points: 0, max: 0, desc: "" }
          : { ...state.hp },
        equipment: [],
        gold: 0,
        spells: [],
      };
    }
    case "SET_RACE":
      // Set the character's race.
      return {
        ...state,
        race: action.payload.race,
        class: [],
        hp: { dice: "", points: 0, max: 0, desc: "" },
        equipment: [],
        gold: 0,
        spells: [],
      };
    case "SET_CLASS": {
      // Set the character's class.
      const getStartingEquipment = (classArray: string[]) => {
        const startingEquipment: EquipmentItem[] = [];
        classArray.some((className) => {
          const hasStartingEquipment =
            classes[className as ClassNames]?.startingEquipment;
          if (hasStartingEquipment) {
            hasStartingEquipment.forEach((item) => {
              item.amount = 1;
            });
            startingEquipment.push(...hasStartingEquipment);
          }
        });
        return startingEquipment;
      };

      let newClassArray;
      if (action.payload.position) {
        if (action.payload.position === "primary") {
          newClassArray =
            [...state.class][1] && action.payload.combinationClass
              ? [...action.payload.class, [...state.class][1]]
              : [...action.payload.class];
        } else {
          newClassArray = [...state.class][0]
            ? [state.class[0], ...action.payload.class]
            : [...action.payload.class];
        }
      } else {
        newClassArray = [...action.payload.class];
      }
      const startingEquipment: EquipmentItem[] =
        getStartingEquipment(newClassArray);

      return {
        ...state,
        class: newClassArray,
        hp: { dice: "", points: 0, max: 0, desc: "" },
        equipment: startingEquipment,
        gold: 0,
        spells: action.payload.keepSpells ? state.spells : [],
      };
    }
    case "SET_SPELLS":
      // Set the character's spells.
      return {
        ...state,
        spells: action.payload.spells,
      };
    case "SET_HP": {
      // Set the character's hit points.
      const dice = action.payload.dice || state.hp.dice;
      const max = action.payload.setMax
        ? +dice.split("d")[1] +
          parseInt(state.abilities.modifiers.constitution as string)
        : state.hp.max;
      const desc = action.payload.desc || state.hp.desc;
      return {
        ...state,
        hp: {
          dice,
          points: action.payload.points,
          max,
          desc,
        },
      };
    }
    case "SET_GOLD":
      // Set the character's gold.
      return {
        ...state,
        gold: action.payload ? action.payload.gold : rollDice("3d6*10"),
      };
    case "SET_EQUIPMENT": {
      const foundItemIndex = state.equipment.findIndex(
        (equipmentItem) => equipmentItem.name === action.payload.item.name,
      );
      const equipment = [...state.equipment];
      let gold = state.gold;

      if (foundItemIndex !== -1) {
        if (action.payload.amount === 0) {
          // Remove item if amount is 0
          const costDifference =
            getItemCost(equipment[foundItemIndex]) *
            equipment[foundItemIndex].amount;
          equipment.splice(foundItemIndex, 1);
          gold = parseFloat((state.gold + costDifference).toFixed(2));
        } else {
          // Determine if an item is being added or removed
          const itemAmount = equipment[foundItemIndex].amount;
          const amountDifference = action.payload.amount - itemAmount;
          const costDifference =
            getItemCost(action.payload.item) * amountDifference;
          gold = parseFloat((state.gold - costDifference).toFixed(2));

          // Update existing item amount
          equipment[foundItemIndex] = {
            ...equipment[foundItemIndex],
            amount: action.payload.amount,
          };
        }
      } else {
        // Add new item if it doesn't exist
        const cost = getItemCost(action.payload.item) * action.payload.amount;
        gold = parseFloat((state.gold - cost).toFixed(2));

        equipment.push({
          ...action.payload.item,
          amount: action.payload.amount,
        });
      }

      return {
        ...state,
        equipment,
        gold,
      };
    }
    case "SET_NAME":
      // Set the character's name.
      return {
        ...state,
        name: action.payload.name,
      };
    case "SET_AVATAR":
      // Set the character's avatar.
      return {
        ...state,
        avatar: action.payload.avatar,
      };
    default:
      return state;
  }
}
