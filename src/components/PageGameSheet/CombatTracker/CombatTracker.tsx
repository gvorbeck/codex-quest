import { ColorScheme } from "@/support/colorSupport";
import { Drawer } from "antd";
import classNames from "classnames";
import React from "react";

interface CombatTrackerProps {
  combatTrackerExpanded: boolean;
  setCombatTrackerExpanded: (expanded: boolean) => void;
}

const CombatTracker: React.FC<
  CombatTrackerProps & React.ComponentPropsWithRef<"div">
> = ({ className, combatTrackerExpanded, setCombatTrackerExpanded }) => {
  const combatTrackerClassNames = classNames(className);
  const onClose = () => {
    setCombatTrackerExpanded(false);
  };
  return (
    <Drawer
      className={combatTrackerClassNames}
      open={combatTrackerExpanded}
      onClose={onClose}
      title="Combat Tracker"
      styles={{ header: { background: ColorScheme.SEABUCKTHORN } }}
    >
      CombatTracker
    </Drawer>
  );
};

export default CombatTracker;
