import { ColorScheme } from "@/support/colorSupport";
import {
  Drawer,
  Flex,
  List,
  Typography,
  Button,
  Tooltip,
  InputNumber,
} from "antd";
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
  const data = [
    { name: "Amanda", avatar: "foo" },
    { name: "George", avatar: "foo" },
    { name: "Goblin" },
  ];
  return (
    <Drawer
      className={combatTrackerClassNames}
      open={combatTrackerExpanded}
      onClose={onClose}
      title="Combat / Turn Tracker"
      styles={{ header: { background: ColorScheme.SEABUCKTHORN } }}
    >
      <List
        header={
          <Flex justify="space-between" gap={16} align="center">
            <Typography.Text>Combatants</Typography.Text>
            <Flex gap={16}>
              <Tooltip title="Roll Monster Initiative">
                <Button></Button>
              </Tooltip>
              <Tooltip title="Clear combatants">
                <Button></Button>
              </Tooltip>
            </Flex>
          </Flex>
        }
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Flex
              gap={16}
              align="center"
              justify="space-between"
              className="w-full"
            >
              <Flex gap={16} align="center">
                {item.avatar && (
                  <span className="rounded-full bg-rust w-8 h-8 block"></span>
                )}
                <Typography.Text>{item.name}</Typography.Text>
              </Flex>
              <Tooltip title="Initiative">
                <InputNumber
                  className="w-[60px] box-content"
                  min={0}
                  defaultValue={0}
                />
              </Tooltip>
            </Flex>
          </List.Item>
        )}
      ></List>
    </Drawer>
  );
};

export default CombatTracker;
