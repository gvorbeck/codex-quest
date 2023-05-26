import { Typography } from "antd";
import { useMemo } from "react";
import { PurchasedEquipmentProps, EquipmentItem } from "../types";
import { toTitleCase } from "../formatters";

export default function PurchasedEquipment({
  gold,
  weight,
  equipment,
}: PurchasedEquipmentProps) {
  const groupedEquipment = useMemo(() => {
    return equipment.reduce(
      (grouped: Record<string, EquipmentItem[]>, item: EquipmentItem) => {
        (grouped[item.category] = grouped[item.category] || []).push(item);
        return grouped;
      },
      {}
    );
  }, [equipment]);

  return (
    <section>
      <header>
        <Typography.Title level={2}>
          Gold: {gold} | Weight: {weight}
        </Typography.Title>
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
