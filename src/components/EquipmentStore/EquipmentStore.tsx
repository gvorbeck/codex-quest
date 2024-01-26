import React from "react";
import {
  CharData,
  EquipmentCategories,
  EquipmentItem,
} from "@/data/definitions";
import {
  Alert,
  Collapse,
  CollapseProps,
  Descriptions,
  DescriptionsProps,
  Flex,
} from "antd";
import {
  equipmentCategoryMap,
  equipmentSubCategoryMap,
  getItemCost,
} from "@/support/equipmentSupport";
import { slugToTitleCase, toSlugCase } from "@/support/stringSupport";
import EquipmentStoreItem from "./EquipmentStoreItem/EquipmentStoreItem";
import { classes } from "@/data/classes";
import { races } from "@/data/races";
import { classSplit, getClassType } from "@/support/classSupport";

interface EquipmentStoreProps {
  character?: CharData;
  equipment: EquipmentItem[];
  setEquipment: (equipment: EquipmentItem[]) => void;
  gold: number;
  setGold: (gold: number) => void;
  newCharacter?: boolean;
}

const equipmentSymbolKeyItems: DescriptionsProps["items"] = [
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

const getFilteredEquipmentCategories = (characterClass: string | string[]) => {
  const equipmentCategories = new Set<string>();

  classSplit(characterClass).forEach((classItem) => {
    const availableCategories =
      classes[classItem as keyof typeof classes].availableEquipmentCategories;
    availableCategories.forEach((category) =>
      equipmentCategories.add(category),
    );
  });

  return Array.from(equipmentCategories);
};

const EquipmentStore: React.FC<
  EquipmentStoreProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  character,
  equipment,
  setEquipment,
  gold,
  setGold,
  newCharacter,
}) => {
  if (!character) return null;
  const noLargeEquipment =
    races[character.race as keyof typeof races]?.noLargeEquipment ?? false;
  const onChange = (value: number | null, item: EquipmentItem) => {
    const newEquipment = equipment.filter((e) => e.name !== item.name);
    if (!!value && value > 0) {
      const newItem = { ...item, amount: value };
      newEquipment.push(newItem);
    }
    const oldEquipmentCost = equipment
      .reduce((acc, curr) => {
        return acc + getItemCost(curr);
      }, 0)
      .toFixed(2);
    const newEquipmentCost = newEquipment
      .reduce((acc, curr) => {
        return acc + getItemCost(curr);
      }, 0)
      .toFixed(2);

    setGold(+(gold + (+oldEquipmentCost - +newEquipmentCost)).toFixed(2));
    setEquipment(newEquipment);
  };

  const generalItems: CollapseProps["items"] = Object.entries(
    equipmentSubCategoryMap(),
  ).map((category, index) => {
    return {
      key: (index + 1).toString(),
      label: slugToTitleCase(category[0]),
      children: (
        <Flex vertical gap={16}>
          {category[1].map((item: EquipmentItem, itemIndex: number) => (
            <EquipmentStoreItem
              key={itemIndex}
              item={item}
              onChange={(e) => onChange(e ? +e : 0, item)}
              // disabled={item.amount === 0 && getItemCost(item) >= gold}
              // max={getItemCost(item) >= gold}
              gold={gold}
            />
          ))}
        </Flex>
      ),
    };
  });

  const items: CollapseProps["items"] = Object.entries(equipmentCategoryMap())
    .sort()
    .map((category, index) => ({
      key: index + 1 + "",
      label: slugToTitleCase(category[0]),
      children: (
        <Flex vertical gap={16}>
          {category[0] === EquipmentCategories.GENERAL ? (
            <Collapse items={generalItems} ghost className="flex flex-col" />
          ) : (
            category[1].map((item: EquipmentItem, index: number) => {
              if (noLargeEquipment && item.size === "L") {
                return null;
              }
              return (
                <EquipmentStoreItem
                  key={index}
                  item={item}
                  onChange={(e) => onChange(e ? +e : 0, item)}
                  // disabled={item.amount === 0 && getItemCost(item) >= gold}
                  // max={getItemCost(item) >= gold}
                  gold={gold}
                />
              );
            })
          )}
        </Flex>
      ),
    }));

  let filteredItems = items;

  if (character && getClassType(character.class) !== "custom") {
    const filteredCategories = getFilteredEquipmentCategories(
      character.class,
    ).map(toSlugCase);

    filteredItems = items.filter((item) => {
      const itemCategory = toSlugCase(item.label as string); // Ensure same format for comparison
      return filteredCategories.includes(itemCategory);
    });
  }

  return (
    <Flex vertical gap={16} className={className}>
      <Collapse
        items={filteredItems}
        collapsible={!gold && newCharacter ? "disabled" : undefined}
      />
      <Alert
        type="info"
        message={
          <Descriptions
            size="small"
            items={equipmentSymbolKeyItems}
            column={1}
            contentStyle={{ fontSize: ".75rem" }}
          />
        }
      />
    </Flex>
  );
};

export default EquipmentStore;
