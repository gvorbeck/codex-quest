import { CharData, EquipmentItem } from "@/data/definitions";
import { rollDice } from "@/support/diceSupport";
import { getAttackBonus } from "@/support/statSupport";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

export const noAmmoMessage = "No ammunition available";

export const getAvailableAmmoOptions = (
  ammo: EquipmentItem["ammo"],
  equipment: EquipmentItem[],
) =>
  ammo?.flatMap((ammo: string) => {
    return equipment.filter((item) => item.name === ammo);
  });

export const getAvailableAmmoSelectOptions = (
  options: EquipmentItem[] | undefined,
) =>
  options?.map((ammo) => ({
    label: `${ammo.name} (${ammo.amount})`,
    value: ammo.name,
  }));

const roller = new DiceRoller();

const checkCriticalFailure = (rollResult: any) => {
  return rollResult.rolls[0].rolls[0].modifierFlags === "__";
};

const checkCriticalSuccess = (rollResult: any) => {
  return rollResult.rolls[0].rolls[0].modifierFlags === "**";
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
    rollResult = roller.roll(
      `1d20cfcs+${getAttackBonus(character)}${
        character.abilities.modifiers.strength
      }`,
    );
  } else {
    rollResult = roller.roll(
      `1d20cfcs+${getAttackBonus(character)}${
        character.abilities.modifiers.dexterity
      }${rangeModifier ? `+${rangeModifier}` : ""}`,
    );
  }

  // Check for critical failure or success
  if (checkCriticalFailure(rollResult)) {
    return { total: "1 (Critical Failure)" };
  } else if (checkCriticalSuccess(rollResult)) {
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

// export const calculateThrownRollResults = ()

export const sendAmmoAttackNotifications = (
  weaponRecovered: boolean,
  rollToHit: any,
  rollToDamage: any,
  openNotification: any,
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
    `To-hit: ${rollToHit.total} Damage: ${rollToDamage} (${rollToHit.notation.split("cfcs").join("")})`,
  );
};
