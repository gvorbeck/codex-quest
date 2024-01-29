import equipmentItems from "../data/equipmentItems.json";
import {
  CharData,
  CostCurrency,
  EquipmentCategories,
  EquipmentItem,
} from "../data/definitions";
import { AttackTypes } from "./stringSupport";
import { DescriptionsProps, RadioChangeEvent, SelectProps } from "antd";

export const onChangeWearing = (
  e: RadioChangeEvent,
  type: "armor" | "shields",
  character: CharData,
  setCharacter: (character: CharData) => void,
) => {
  setCharacter({
    ...character,
    wearing: {
      armor:
        type === "armor"
          ? e.target.value || ""
          : character.wearing?.armor || "",
      shield:
        type === "shields"
          ? e.target.value || ""
          : character.wearing?.shield || "",
    },
  });
};

export const equipmentSymbolKeyItems: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "**",
    children: "This weapon only does subduing damage",
  },
  {
    key: "2",
    label: "(E)",
    children: "Entangling: This weapon may be used to snare or hold opponents.",
  },
  {
    key: "3",
    label: "†",
    children: "Silver tip or blade, for use against lycanthropes.",
  },
];

// Get an object with properties for every equipment category. Those properties are arrays of equipment items.
// If no equipment list is provided, the default equipment list is used.
export const equipmentCategoryMap = (
  equipmentList: EquipmentItem[] = equipmentItems as EquipmentItem[],
) => {
  const equipmentCategories: Record<string, EquipmentItem[]> = {};

  equipmentList.forEach((item: EquipmentItem) => {
    if (equipmentCategories[item.category]) {
      equipmentCategories[item.category].push(item);
    } else {
      equipmentCategories[item.category] = [item];
    }
  });

  return equipmentCategories;
};

export const equipmentSubCategoryMap = () => {
  const equipmentSubCategories: Record<string, EquipmentItem[]> = {};

  (equipmentItems as EquipmentItem[])
    .filter((item) => item.category === EquipmentCategories.GENERAL)
    .forEach((item: EquipmentItem) => {
      if (item.subCategory) {
        if (equipmentSubCategories[item.subCategory]) {
          equipmentSubCategories[item.subCategory].push(item);
        } else {
          equipmentSubCategories[item.subCategory] = [item];
        }
      }
    });

  return equipmentSubCategories;
};

export const punchItem: EquipmentItem = {
  name: "Punch**",
  costValue: 0,
  costCurrency: "gp",
  category: "inherent",
  damage: "1d3",
  amount: 1,
  type: AttackTypes.MELEE,
  noDelete: true,
};

export const kickItem: EquipmentItem = {
  name: "Kick**",
  costValue: 0,
  costCurrency: "gp",
  category: "inherent",
  damage: "1d4",
  amount: 1,
  type: AttackTypes.MELEE,
  noDelete: true,
};

export const equipmentNames = equipmentItems.map((item) => item.name);

export const getItemCost = (item: EquipmentItem) => {
  let cost = item.costValue;
  if (item.costCurrency === "sp") cost *= 0.1;
  if (item.costCurrency === "cp") cost *= 0.01;
  return cost * item.amount;
};

export type ArmorCategory = "lightArmor" | "mediumArmor" | "heavyArmor";

export const CURRENCIES: CostCurrency[] = ["gp", "sp", "cp"];
export const equipmentSizes: SelectProps["options"] = [
  {
    label: "S",
    value: "S",
  },
  {
    label: "M",
    value: "M",
  },
  {
    label: "L",
    value: "L",
  },
];
