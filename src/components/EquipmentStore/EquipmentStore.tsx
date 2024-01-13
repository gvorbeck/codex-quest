import React from "react";
import { EquipmentCategories, EquipmentItem } from "@/data/definitions";
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
} from "@/support/equipmentSupport";
import { slugToTitleCase } from "@/support/stringSupport";
import EquipmentStoreItem from "./EquipmentStoreItem/EquipmentStoreItem";
import { getItemCost } from "@/support/characterSupport";

interface EquipmentStoreProps {
  equipment: EquipmentItem[];
  setEquipment: (equipment: EquipmentItem[]) => void;
  gold: number;
  setGold: (gold: number) => void;
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

const EquipmentStore: React.FC<
  EquipmentStoreProps & React.ComponentPropsWithRef<"div">
> = ({ className, equipment, setEquipment, gold, setGold }) => {
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
            category[1].map((item: EquipmentItem, index: number) => (
              <EquipmentStoreItem
                key={index}
                item={item}
                onChange={(e) => onChange(e ? +e : 0, item)}
                // disabled={item.amount === 0 && getItemCost(item) >= gold}
                // max={getItemCost(item) >= gold}
                gold={gold}
              />
            ))
          )}
        </Flex>
      ),
    }));
  return (
    <Flex vertical gap={16} className={className}>
      <Collapse items={items} collapsible={!gold ? "disabled" : undefined} />
      <Alert
        type="info"
        message={<Descriptions size="small" items={equipmentSymbolKeyItems} />}
      />
    </Flex>
  );
};

export default EquipmentStore;
