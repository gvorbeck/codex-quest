import React from "react";
import { EquipmentItem } from "@/data/definitions";
import { Descriptions, DescriptionsProps, InputNumber } from "antd";
import { getItemCost } from "@/support/equipmentSupport";

interface EquipmentStoreItemProps {
  item: EquipmentItem;
  onChange: ((value: number | null) => void) | undefined;
  disabled?: boolean;
  gold: number;
}

const EquipmentStoreItem: React.FC<
  EquipmentStoreItemProps & React.ComponentPropsWithRef<"div">
> = ({ className, item, onChange, disabled, gold }) => {
  const maxItemsAffordable = Math.floor(gold / getItemCost(item));
  const damageItem = {
    key: "damage",
    label: "Damage",
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
    children: item.missileAC,
  };
  const rangeItem = {
    key: "range",
    label: "Range",
    children: item.range?.join(" / "),
  };
  const ammoItem = {
    key: "ammo",
    label: "Ammo",
    children: <span className="text-xs">{item.ammo?.join(", ")}</span>,
  };
  const items: DescriptionsProps["items"] = [
    {
      key: "name",
      label: "Name",
      children: <span className="font-bold">{item.name}</span>,
    },
    {
      key: "cost",
      label: "Cost",
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
        defaultValue={item.amount}
        min={0}
        max={maxItemsAffordable}
        onChange={(value) => onChange && onChange(value)}
        disabled={disabled}
      />
    ),
  });

  return (
    <Descriptions size="small" className={className} items={items} bordered />
  );
};

export default EquipmentStoreItem;
