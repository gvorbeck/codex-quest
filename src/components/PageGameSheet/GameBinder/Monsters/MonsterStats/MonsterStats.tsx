import { MonsterStats } from "@/data/definitions";
import { Descriptions, DescriptionsProps } from "antd";
import React from "react";

interface MonsterStatsProps {
  stats: MonsterStats;
}

const MonsterStats: React.FC<
  MonsterStatsProps & React.ComponentPropsWithRef<"div">
> = ({ className, stats }) => {
  const items: DescriptionsProps["items"] = [
    { key: "1", label: "AC", children: stats.ac },
    { key: "2", label: "Hit Dice", children: stats.hitDice },
    { key: "3", label: "# of Attacks", children: stats.numAttacks },
    { key: "4", label: "Damage", children: stats.damage },
    { key: "5", label: "Movement", children: stats.movement },
    { key: "6", label: "# Appearing", children: stats.numAppear },
    { key: "7", label: "Save As", children: stats.saveAs },
    { key: "8", label: "Morale", children: stats.morale },
    { key: "9", label: "Treasure Type", children: stats.treasure },
    { key: "11", label: "XP", children: stats.xp },
  ];
  return (
    <Descriptions
      className={className}
      items={items}
      bordered
      column={2}
      size="small"
    />
  );
};

export default MonsterStats;
