import {
  CharData,
  ClassNames,
  DiceTypes,
  EquipmentCategories,
  EquipmentItem,
  RaceNames,
  SavingThrowsType,
  UpdateCharAction,
} from "@/data/definitions";
import { AttackTypes, titleCaseToCamelCase } from "./stringSupport";
import { races } from "@/data/races";
import equipmentItems from "../data/equipment.json";
import { getEquipmentItemFromName } from "./equipmentSupport";
import { getClassType } from "./classSupport";
import { classes } from "@/data/classes";
import { Tooltip } from "antd";
import { rollDiceDetailed } from "./diceSupport";
import { clsx } from "clsx";

// Calculate the modifier for an ability score.
export function calculateModifier(score: number) {
  let modifier;
  if (score === null) modifier = "";
  if (score === 3) modifier = "-3";
  else if (score <= 5) modifier = "-2";
  else if (score <= 8) modifier = "-1";
  else if (score <= 12) modifier = "+0";
  else if (score <= 15) modifier = "+1";
  else if (score <= 17) modifier = "+2";
  else if (score === 18) modifier = "+3";
  return modifier;
}

export const rollSpecialAbility = (
  score: number,
  title: string,
  openNotification: (result: string, specialAbilityTable: string) => void,
) => {
  const result = rollDiceDetailed(`d%`);
  const passFail = result.total <= score ? "Pass" : "Fail";
  openNotification(result.output + " - " + passFail, title);
};

export const rollSavingThrow = (
  score: number,
  title: string,
  race: string,
  openNotification: (result: string, savingThrowTitle: string) => void,
) => {
  const raceModifier =
    races[race as RaceNames]?.savingThrows?.[
      titleCaseToCamelCase(title) as keyof SavingThrowsType
    ] || 0;
  const result = rollDiceDetailed(
    `d20${raceModifier > 0 ? `+${raceModifier}` : ""}`,
  );
  const passFail = result.total >= score ? "Pass" : "Fail";
  openNotification(result.output + " - " + passFail, title);
};

export const getArmorClass = (
  character: CharData,
  characterDispatch: React.Dispatch<UpdateCharAction>,
  type: AttackTypes.MISSILE | AttackTypes.MELEE = AttackTypes.MELEE,
) => {
  if (!character) return;

  const { race, wearing, equipment } = character;
  const armorClass = races[race as RaceNames]?.altBaseAC || 11;

  if (!wearing) {
    characterDispatch({
      type: "UPDATE",
      payload: { wearing: { armor: "", shield: "" } },
    });
    return armorClass;
  }

  const acType = type === AttackTypes.MELEE ? "AC" : "missileAC";
  // Calculate Armor AC and Shield AC from equipmentItems or character's equipment
  const armorAC =
    findACValue(equipmentItems as EquipmentItem[], wearing.armor, "AC") ||
    findACValue(equipment, wearing.armor, "AC");
  const shieldAC =
    findACValue(equipmentItems as EquipmentItem[], wearing.shield, acType) ||
    findACValue(equipment, wearing.shield, acType);

  return (
    Math.max(armorClass + shieldAC, armorAC + shieldAC) +
    +character.abilities.modifiers.dexterity
  );
};

const findACValue = (
  itemList: EquipmentItem[],
  itemName: string,
  acType: "AC" | "missileAC",
) => {
  const foundItem = itemList.find((item) => item.name === itemName);
  return Number(foundItem?.[acType] || 0);
};

export const getWeight = (character: CharData) => {
  const weightModifier = (item: EquipmentItem) => {
    if (
      races[character.race as RaceNames]?.equipmentWeightModifier?.[0] ===
      item.category
    ) {
      return (
        (item.weight ?? 0) *
        (races[character.race as RaceNames]?.equipmentWeightModifier?.[1] ?? 1)
      );
    }
    return item.weight ?? 0;
  };
  const equipmentWeight = character.equipment.reduce(
    (accumulator: number, currentValue: EquipmentItem) => {
      return (
        accumulator +
        (weightModifier(currentValue) ?? 0) * (currentValue.amount ?? 0)
      );
    },
    0,
  );
  const coinsWeight =
    (character.gold ?? 0) * 0.05 +
    (character.silver ?? 0) * 0.05 +
    (character.copper ?? 0) * 0.05 +
    (character.electrum ?? 0) * 0.05 +
    (character.platinum ?? 0) * 0.05;
  return equipmentWeight + (character.useCoinWeight ? coinsWeight : 0);
};

export const getMovement = (characterData: CharData) => {
  if (!characterData) return;

  const armorSpeedMap: [number, number][] = [
    [40, 30],
    [30, 20],
    [20, 10],
  ];

  const carryingCapacity = getCarryingCapacity(characterData);
  // 0 = no armor/m,agic leather, 1 = leather/magic metal, 2 = metal
  const armorItem = characterData.wearing?.armor
    ? characterData.equipment.find(
        (item) => item.name === characterData.wearing?.armor,
      )
    : undefined;
  let currentArmor: number = Number(armorItem?.type) || 0;

  if (typeof currentArmor === "string") {
    currentArmor = 0; // Default to 0 if currentArmor is a string (it used to be)
  }
  const currentWeight = getWeight(characterData);
  // PC does not have an animal
  if (!carryingCapacity.animal) {
    return carryingCapacity.light >= currentWeight
      ? armorSpeedMap[currentArmor][0]
      : armorSpeedMap[currentArmor][1];
  } else {
    return carryingCapacity.player!.light >= currentWeight
      ? armorSpeedMap[currentArmor][0]
      : armorSpeedMap[currentArmor][1];
  }
};

// Helper function to get the strength range
const getStrengthRange = (strength: number): string => {
  if (strength === 3) return "3";
  if (strength >= 4 && strength <= 5) return "4-5";
  if (strength >= 6 && strength <= 8) return "6-8";
  if (strength >= 9 && strength <= 12) return "9-12";
  if (strength >= 13 && strength <= 15) return "13-15";
  if (strength >= 16 && strength <= 17) return "16-17";
  if (strength === 18) return "18";
  return ""; // Handle out-of-range strength values
};

type Capacity = { light: number; heavy: number };
type CapacityMap = Record<string, Capacity>;

export const getCarryingCapacity = (character: CharData) => {
  if (!character) return { light: 0, heavy: 0 };
  let animalCapacity: Capacity = { light: 0, heavy: 0 };
  const hasBeast = character.equipment.some(
    (item) => item.category === EquipmentCategories.BEASTS,
  );
  if (hasBeast) {
    animalCapacity = character.equipment.reduce(
      (acc, currItem) => {
        if (currItem.category === EquipmentCategories.BEASTS) {
          const beast = getEquipmentItemFromName(currItem.name);
          return {
            light: acc.light + (beast?.lowCapacity ?? 0) * currItem.amount,
            heavy: acc.heavy + (beast?.capacity ?? 0) * currItem.amount,
          };
        }
        return acc;
      },
      { light: 0, heavy: 0 },
    );
  }

  const capacities: CapacityMap = {
    "3": { light: 25, heavy: 60 },
    "4-5": { light: 35, heavy: 90 },
    "6-8": { light: 50, heavy: 120 },
    "9-12": { light: 60, heavy: 150 },
    "13-15": { light: 65, heavy: 165 },
    "16-17": { light: 70, heavy: 180 },
    "18": { light: 80, heavy: 195 },
  };
  const lowCapacities: CapacityMap = {
    "3": { light: 20, heavy: 40 },
    "4-5": { light: 30, heavy: 60 },
    "6-8": { light: 40, heavy: 80 },
    "9-12": { light: 50, heavy: 100 },
    "13-15": { light: 55, heavy: 110 },
    "16-17": { light: 60, heavy: 120 },
    "18": { light: 65, heavy: 130 },
  };
  const range = getStrengthRange(character.abilities.scores.strength as number);
  const charCapacity = races[character.race as RaceNames]?.hasLowCapacity
    ? lowCapacities[range]
    : capacities[range];

  return {
    light: charCapacity.light + animalCapacity.light,
    heavy: charCapacity.heavy + animalCapacity?.heavy,
    player: hasBeast ? charCapacity : undefined,
    animal: hasBeast ? animalCapacity : undefined,
  };
};

export const getAttackBonus = (character: CharData) => {
  if (getClassType(character.class).includes("custom")) return 0;
  let maxAttackBonus = 0;

  character.class.forEach((classPiece) => {
    const classAttackBonus =
      classes[classPiece as ClassNames]?.attackBonus[character.level];
    if (classAttackBonus > maxAttackBonus) {
      maxAttackBonus = classAttackBonus;
    }
  });

  return maxAttackBonus;
};

export const getRaceRangedAttackBonus = (character: CharData) => {
  return races[character.race as RaceNames]?.rangedBonus
    ? races[character.race as RaceNames].rangedBonus
    : 0;
};

const getHitPointsModifier = (classArr: string[]) => {
  let modifier = 0;
  for (const className of classArr) {
    const classHitDiceModifier =
      classes[className as ClassNames]?.hitDiceModifier;
    if (classHitDiceModifier > modifier) {
      modifier = classHitDiceModifier;
    }
  }
  return modifier;
};

// level: number, not always the same as character.level
export const getHitDice = (
  level: number,
  character: CharData,
  dice: string,
) => {
  if (!dice) {
    dice = getCharacterHitDiceFromClass(character) as string;
  }
  const dieType = dice.split("d")[1].split("+")[0];
  const prefix = Math.min(level, 9);

  // Calculate the suffix
  const suffix =
    (level > 9 ? level - 9 : 0) * getHitPointsModifier(character.class);

  // Combine to create the result
  const result = `${prefix}d${dieType}${suffix > 0 ? "+" + suffix : ""}`;
  return result;
};

export function getCharacterHitDiceFromClass(character: CharData) {
  const diceArr = [
    DiceTypes.D3,
    DiceTypes.D4,
    DiceTypes.D6,
    DiceTypes.D8,
    DiceTypes.D10,
    DiceTypes.D12,
    DiceTypes.D20,
  ];
  const { race } = character;
  const classType = getClassType(character.class);
  // Some races require the character's hit dice to be incremented or decremented
  const incrementChecker = (dice: DiceTypes) => {
    // The index of the character's hit die in the diceArr
    let diceIndex = diceArr.indexOf(dice);
    // The max index a character's hit die is allowed to be in the diceArr
    const diceMaxIndex = diceArr.indexOf(
      races[race as RaceNames]?.maximumHitDice ?? DiceTypes.D20,
    );
    if (races[race as RaceNames]?.incrementHitDie) {
      diceIndex++;
    }
    if (races[race as RaceNames]?.decrementHitDie) {
      diceIndex--;
    }
    // If a character's hit die is greater than the max allowed hit die, set it to the max allowed hit die
    if (diceIndex > diceMaxIndex) {
      diceIndex = diceMaxIndex;
    }
    return diceArr[diceIndex];
  };
  if (classType[0] === "combination") {
    if (character.class.includes(ClassNames.FIGHTER)) {
      return incrementChecker(DiceTypes.D6);
    }
    if (character.class.includes(ClassNames.THIEF)) {
      return incrementChecker(DiceTypes.D4);
    }
  } else if (classType[0] === "standard") {
    return incrementChecker(classes[character.class[0] as ClassNames].hitDice);
  }
  return (character.hp.dice as DiceTypes) || undefined;
}

const getSavingThrows = (className: string, level: number) =>
  classes[className as ClassNames]?.savingThrows.find(
    (savingThrow) => (savingThrow[0] as number) >= level,
  )?.[1] as SavingThrowsType;

const getSavingThrowsWeight = (savingThrows: SavingThrowsType) =>
  Object.values(savingThrows).reduce((prev, curr) => prev + curr, 0);

export const getBestSavingThrowList = (charClass: string[], level: number) => {
  const defaultSavingThrows: SavingThrowsType = {
    deathRayOrPoison: 0,
    magicWands: 0,
    paralysisOrPetrify: 0,
    dragonBreath: 0,
    spells: 0,
  };
  const classType = getClassType(charClass);
  // if classType is standard, find saving throws for that class
  if (classType.includes("standard")) {
    return getSavingThrows(charClass.join(), level) || defaultSavingThrows;
    // if classType is combination, find saving throws for each class and use the best
  } else {
    const [firstClass, secondClass] = charClass;
    const firstClassSavingThrows = getSavingThrows(firstClass, level);
    const secondClassSavingThrows = getSavingThrows(secondClass, level);
    return getSavingThrowsWeight(firstClassSavingThrows) <=
      getSavingThrowsWeight(secondClassSavingThrows)
      ? firstClassSavingThrows
      : secondClassSavingThrows;
  }
};

export const getExtraIcons = (character: CharData, isDarkMode: boolean) => {
  type IconComponentProps = React.SVGProps<SVGSVGElement>;
  type IconTuple = [React.FC<IconComponentProps>, string];
  const raceIcons = races[character.race as RaceNames]?.icons || [];
  const classIcons = character.class.reduce((acc: IconTuple[], charClass) => {
    const classIcon = classes[charClass as ClassNames]?.icons || [];
    return [...acc, ...classIcon];
  }, [] as IconTuple[]);

  const fullIcons = [...raceIcons, ...classIcons];
  const iconClassNames = clsx(
    "w-8 h-8 [&_svg]:max-h-5 fill-current aspect-square flex items-center justify-center p-0.5 rounded-full cursor-pointer border-solid",
    {
      "bg-ship-gray border-spring-wood": isDarkMode,
      "bg-spring-wood border-ship-gray": !isDarkMode,
    },
  );
  return (
    <ul className="list-none flex gap-2 p-0">
      {fullIcons.map(([IconComponent, iconDescription], index) => (
        <li key={index}>
          <Tooltip title={iconDescription}>
            <div className={iconClassNames}>
              <IconComponent />
            </div>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
};
