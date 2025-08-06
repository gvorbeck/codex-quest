import { CharData, EquipmentItem } from "@/data/definitions";
import { rollDice, rollDiceDetailed } from "@/support/diceSupport";
import { getAttackBonus } from "@/support/statSupport";
import equipmentData from "@/data/equipment.json";

export const noAmmoMessage = "No ammunition available";

const findAmmoItems = (
  ammo: string[],
  equipment: EquipmentItem[],
): EquipmentItem[] => {
  return ammo
    .map((ammoName) => equipment.find((item) => item.name === ammoName))
    .filter(Boolean) as EquipmentItem[];
};

const findCharacterAmmunition = (
  equipment: EquipmentItem[],
): EquipmentItem[] => {
  return equipment.filter(
    (item) =>
      item.category === "ammunition" &&
      !equipmentData.find((e) => e.name === item.name),
  );
};

export const getAvailableAmmoOptions = (
  ammo: EquipmentItem["ammo"],
  equipment: EquipmentItem[],
): EquipmentItem[] => {
  if (!ammo) return [];

  const ammoItems = findAmmoItems(ammo, equipment);
  const charAmmunitionItems = findCharacterAmmunition(equipment);
  // Set removes any duplicates
  const optionsSet = new Set<EquipmentItem>([
    ...ammoItems,
    ...charAmmunitionItems,
  ]);

  return Array.from(optionsSet);
};

export const getAvailableAmmoSelectOptions = (
  options: EquipmentItem[] | undefined,
) =>
  options?.map((ammo) => ({
    label: `${ammo.name} (${ammo.amount})`,
    value: ammo.name,
  }));

// Critical hit/failure detection - check the raw d20 roll
const isCriticalFailure = (rollResult: { total: number; output: string }) => {
  // Extract the raw d20 roll from the output string
  const match = rollResult.output.match(/\b(1|20)\b/);
  return match && match[1] === "1";
};

const isCriticalSuccess = (rollResult: { total: number; output: string }) => {
  // Extract the raw d20 roll from the output string
  const match = rollResult.output.match(/\b(1|20)\b/);
  return match && match[1] === "20";
};

export const getRollToHitResult = (
  character: CharData,
  type: "melee" | "missile" = "melee",
  range: null | undefined | string = null,
) => {
  // Perform the roll
  let rangeModifier = 0;
  if (range === "S") {
    rangeModifier = 1;
  } else if (range === "M") {
    rangeModifier = 0;
  } else if (range === "L") {
    rangeModifier = -2;
  }
  let rollResult;
  if (type === "melee") {
    rollResult = rollDiceDetailed(
      `1d20+${getAttackBonus(character)}${
        character.abilities.modifiers.strength
      }`,
    );
  } else {
    rollResult = rollDiceDetailed(
      `1d20+${getAttackBonus(character)}${
        character.abilities.modifiers.dexterity
      }${rangeModifier ? `+${rangeModifier}` : ""}`,
    );
  }

  // Check for critical failure or success using the roll result
  if (isCriticalFailure(rollResult)) {
    return { total: "1 (Critical Failure)" };
  } else if (isCriticalSuccess(rollResult)) {
    return { total: "20 (Critical Success)" };
  }

  return rollResult;
};

export const getRollToThrownDamageResult = (
  equipment: EquipmentItem[],
  ammoSelection: string | undefined,
  character: CharData,
) => {
  const weapon = getWeapon(ammoSelection ?? "", equipment);
  let { damage } = weapon ?? { damage: "" };
  damage += character.abilities.modifiers.strength + "";
  return rollDice(damage ?? "");
};

export const getRollToAmmoDamageResult = (
  equipment: EquipmentItem[],
  ammoSelection: string | undefined,
  character: CharData,
) => {
  const weapon = getWeapon(ammoSelection ?? "", equipment);
  let { damage } = weapon ?? { damage: "" };
  if (
    weapon?.name.toLowerCase().includes("bullet") ||
    weapon?.name.toLowerCase().includes("stone")
  ) {
    damage += character.abilities.modifiers.strength + "";
  }
  return rollDice(damage ?? "");
};

export const getWeapon = (name: string, equipment: EquipmentItem[]) =>
  equipment.find((e) => e.name === name);

export const sendAmmoAttackNotifications = (
  weaponRecovered: boolean,
  rollToHit: { total: number | string },
  rollToDamage: number,
  openNotification: (title: string, message: string) => void,
  ammoSelection: string | undefined,
  item: EquipmentItem,
) => {
  if (weaponRecovered) {
    openNotification(
      "Ammo recovered",
      `You recovered 1 ${ammoSelection} in the attack`,
    );
  }
  openNotification(
    `Attack with ${item.name}`,
    `To-hit: ${rollToHit.total} Damage: ${rollToDamage}`,
  );
};
