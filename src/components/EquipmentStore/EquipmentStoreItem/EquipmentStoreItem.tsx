import React from "react";
import { EquipmentItem } from "@/data/definitions";
import { Descriptions, DescriptionsProps, InputNumber } from "antd";
import { getItemCost } from "@/support/equipmentSupport";

interface EquipmentStoreItemProps {
  item: EquipmentItem;
  onChange: ((value: number | null) => void) | undefined;
  disabled?: boolean;
  gold: number;
  characterAmount?: number;
}

const EquipmentStoreItem: React.FC<
  EquipmentStoreItemProps & React.ComponentPropsWithRef<"div">
> = ({ className, item, onChange, disabled, gold, characterAmount }) => {
  const maxItemsAffordable = Math.floor(gold / getItemCost(item));
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
    children: item.weight,
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
        defaultValue={characterAmount ?? item.amount}
        min={0}
        max={maxItemsAffordable}
        onChange={(value) => onChange && onChange(value)}
        disabled={disabled}
        className="w-fit"
      />
    ),
  });

  return (
    <Descriptions
      size="small"
      className={className}
      items={items}
      column={3}
      bordered
    />
  );
};

export default EquipmentStoreItem;
