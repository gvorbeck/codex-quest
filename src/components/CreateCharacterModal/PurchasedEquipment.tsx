import { Typography } from "antd";
import { useMemo } from "react";
import { PurchasedEquipmentProps, EquipmentItem } from "../types";
import { toTitleCase } from "../formatters";

export default function PurchasedEquipment({
  characterData,
  weightRestrictions,
}: PurchasedEquipmentProps) {
  const groupedEquipment = useMemo(() => {
    return characterData.equipment.reduce(
      (grouped: Record<string, EquipmentItem[]>, item: EquipmentItem) => {
        (grouped[item.category] = grouped[item.category] || []).push(item);
        return grouped;
      },
      {}
    );
  }, [characterData.equipment]);

  return (
    <section>
      <header>
        <Typography.Title level={2} className="text-shipGray mt-0 mb-0">
          Gold: {characterData.gold.toFixed(2)} | Weight:{" "}
          {characterData.weight.toFixed(2)}
        </Typography.Title>
        <Typography.Text type="secondary">
          Max weight: {weightRestrictions.heavy}{" "}
          {characterData.weight > weightRestrictions.light &&
            "/ Heavily Loaded!"}
        </Typography.Text>
      </header>
      <div>
        {Object.entries(groupedEquipment).map(
          ([category, items]: [string, EquipmentItem[]]) => (
            <div key={category}>
              <Typography.Title level={3}>
                {toTitleCase(category.replaceAll("-", " "))}
              </Typography.Title>
              {items.map((item: EquipmentItem) => (
                <div key={item.name}>
                  {item.name} x{item.amount}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}
