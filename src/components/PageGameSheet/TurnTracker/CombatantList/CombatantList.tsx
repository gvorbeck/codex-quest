import React from "react";
import CombatantListHeader from "../CombatantListHeader/CombatantListHeader";
import CombatantCard from "../CombatantCard/CombatantCard";
import { List } from "antd";
import { GameDataContext } from "@/store/GameDataContext";
import { useRoundTracker } from "@/hooks/useRoundTacker";

const CombatantList: React.FC = () => {
  const { combatants, setCombatants } = React.useContext(GameDataContext);
  const { turn } = useRoundTracker(combatants, setCombatants);

  return (
    <List
      split={false}
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
