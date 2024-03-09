import { ColorScheme } from "@/support/colorSupport";
import { Drawer, Divider } from "antd";
import classNames from "classnames";
import React from "react";
import { CombatantType } from "@/data/definitions";
import { useTurnTracker } from "@/hooks/useTurnTacker";
import CombatantList from "./CombatantList/CombatantList";
import TurnControls from "./TurnControls/TurnControls";

interface TurnTrackerProps {
  turnTrackerExpanded: boolean;
  setTurnTrackerExpanded: (expanded: boolean) => void;
  combatants: CombatantType[];
  setCombatants: (combatants: CombatantType[]) => void;
}

const TurnTracker: React.FC<
  TurnTrackerProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  turnTrackerExpanded,
  setTurnTrackerExpanded,
  combatants,
  setCombatants,
}) => {
  const { setTurn, turn } = useTurnTracker(combatants, setCombatants);
  const turnTrackerClassNames = classNames(className);
  const onClose = () => {
    setTurnTrackerExpanded(false);
  };
  return (
    <Drawer
      className={turnTrackerClassNames}
      open={turnTrackerExpanded}
      onClose={onClose}
      title="Round Tracker"
      styles={{ header: { background: ColorScheme.SEABUCKTHORN } }}
    >
      <TurnControls turn={turn} setTurn={setTurn} combatants={combatants} />
      <Divider className="mt-3" />
      <CombatantList
        combatants={combatants}
        setCombatants={setCombatants}
        turn={turn}
      />
    </Drawer>
  );
};

export default TurnTracker;
