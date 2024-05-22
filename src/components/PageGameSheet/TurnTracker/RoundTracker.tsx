import React from "react";
import { ColorScheme } from "@/support/colorSupport";
import { Drawer, Divider } from "antd";
import CombatantList from "./CombatantList/CombatantList";
import TurnControls from "./TurnControls/TurnControls";

interface TurnTrackerProps {
  roundTrackerOpen: boolean;
  handleRoundTrackerClose: () => void;
}

const RoundTracker: React.FC<
  TurnTrackerProps & React.ComponentPropsWithRef<"div">
> = ({ className, roundTrackerOpen, handleRoundTrackerClose }) => {
  return (
    <Drawer
      className={className}
      open={roundTrackerOpen}
      onClose={handleRoundTrackerClose}
      title="Round Tracker"
      styles={{ header: { background: ColorScheme.SEABUCKTHORN } }}
    >
      <TurnControls />
      <Divider className="mt-3" />
      <CombatantList />
    </Drawer>
  );
};

export default RoundTracker;
