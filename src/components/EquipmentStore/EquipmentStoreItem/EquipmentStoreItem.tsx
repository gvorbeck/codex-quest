import React from "react";
import {
  CharData,
  ClassNames,
  EquipmentItem,
  RaceNames,
} from "@/data/definitions";
import { Descriptions, DescriptionsProps, InputNumber } from "antd";
import { getItemCost } from "@/support/equipmentSupport";
import { races } from "@/data/races";
import { classes } from "@/data/classes";

interface EquipmentStoreItemProps {
  item: EquipmentItem;
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
}

const EquipmentStoreItem: React.FC<
  EquipmentStoreItemProps & React.ComponentPropsWithRef<"div">
> = ({ className, item, character, setCharacter }) => {
  function getItemWeight() {
    let weight = 0;
    const modifier =
      races[character.race as RaceNames]?.equipmentWeightModifier;
    if (modifier?.length && modifier[0] === item.category) {
      weight = item.weight! * modifier[1];
    }
    return weight;
  }

  function isSizeDisabled() {
    if (item.size !== "L") return false;
    const raceDisabled = races[character.race as RaceNames]?.noLargeEquipment;
    const classDisabled = character.class.some(
      (className) => classes[className as ClassNames]?.noLargeEquipment,
    );
    return raceDisabled || classDisabled;
  }

  function isAffordable() {
    return character.gold < getItemCost(item);
  }

  const damageItem = {
    key: "damage",
    label: "Damage",
    span: 2,
    children: item.damage,
  };
  const sizeItem = { key: "size", label: "Size", children: item.size };
  const weightItem = {
    key: "weight",
    label: "Weight",
    children: getItemWeight(),
  };
  const acItem = { key: "ac", label: "AC", children: item.AC };
  const missileACItem = {
    key: "missileAC",
    label: "Missile AC",
    span: 2,
    children: item.missileAC,
  };
  const rangeItem = {
    key: "range",
    label: "Range",
    span: 2,
    children: item.range?.join(" / "),
  };
  const ammoItem = {
    key: "ammo",
    label: "Ammo",
    span: 2,
    children: <span className="text-xs">{item.ammo?.join(", ")}</span>,
  };
  const items: DescriptionsProps["items"] = [
    {
      key: "name",
      label: "Name",
      span: 3,
      children: <span className="font-bold">{item.name}</span>,
    },
    {
      key: "cost",
      label: "Cost",
      span: 2,
      children: item.costValue + " " + item.costCurrency,
    },
  ];

  if (item.weight) items.push(weightItem);
  if (item.size) items.push(sizeItem);
  if (item.damage) items.push(damageItem);
  if (item.AC) items.push(acItem);
  if (item.missileAC) items.push(missileACItem);
  if (item.range) items.push(rangeItem);
  if (item.ammo) items.push(ammoItem);
  items.push({
    key: "amount",
    label: "Amount",
    children: (
      <InputNumber
        defaultValue={
          character.equipment.some((eqItem) => eqItem.name === item.name)
            ? character.equipment.find((eqItem) => eqItem.name === item.name)
                ?.amount || 0
            : 0
        }
        min={0}
        onChange={handleAmountChange}
        disabled={isAffordable() || isSizeDisabled()}
        className="w-fit"
      />
    ),
  });

  function handleAmountChange(value: number | null) {
    setCharacter((prevCharacter) => {
      const foundItemIndex = prevCharacter.equipment.findIndex(
        (eqItem) => eqItem.name === item.name,
      );

      const newEquipment = [...prevCharacter.equipment];
      if (foundItemIndex !== -1) {
        // Update existing item amount
        newEquipment[foundItemIndex] = {
          ...newEquipment[foundItemIndex],
          amount: value ?? 0,
        };
      } else {
        // Add new item if it doesn't exist
        newEquipment.push({ ...item, amount: value ?? 0 });
      }

      return {
        ...prevCharacter,
        equipment: newEquipment,
        gold: parseFloat((prevCharacter.gold - getItemCost(item)).toFixed(2)),
      };
    });
  }

  return (
    <Descriptions
      labelStyle={{ fontSize: ".75rem", padding: "4px" }}
      contentStyle={{ fontSize: ".75rem" }}
      size="small"
      className={className}
      items={items}
      column={3}
      bordered
    />
  );
};

export default EquipmentStoreItem;
