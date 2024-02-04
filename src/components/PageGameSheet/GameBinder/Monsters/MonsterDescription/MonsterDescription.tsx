import { Monster } from "@/data/definitions";
import React from "react";

interface MonsterDescriptionProps {
  monster: Monster;
}

const MonsterDescription: React.FC<
  MonsterDescriptionProps & React.ComponentPropsWithRef<"div">
> = ({ className, monster }) => {
  return <div className={className}>{monster.name} MonsterDescription</div>;
};

export default MonsterDescription;
