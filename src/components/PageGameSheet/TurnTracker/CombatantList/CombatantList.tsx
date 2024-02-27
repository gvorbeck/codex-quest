import React from "react";
import CombatantListHeader from "../CombatantListHeader/CombatantListHeader";
import CombatantCard from "../CombatantCard/CombatantCard";
import { List } from "antd";
import { CombatantType } from "@/data/definitions";

interface CombatantListProps {
  combatants: CombatantType[];
  setCombatants: (combatants: CombatantType[]) => void;
  turn: number;
}

const CombatantList: React.FC<
  CombatantListProps & React.ComponentPropsWithRef<"div">
> = ({ className, combatants, setCombatants, turn }) => {
  return (
    <List
      split={false}
      className={className}
      header={
        <CombatantListHeader
          combatants={combatants}
          setCombatants={setCombatants}
        />
      }
      dataSource={combatants}
      renderItem={(combatant, index) => (
        <List.Item key={combatant.name} className="relative">
          {turn === index && (
            <div
              className="w-2 h-2 bg-sushi rounded-full absolute -left-4 top-7"
              data-testid="turn-indicator"
            />
          )}
          <CombatantCard
            combatant={combatant}
            combatants={combatants}
            setCombatants={setCombatants}
            index={index}
          />
        </List.Item>
      )}
    />
  );
};

export default CombatantList;
