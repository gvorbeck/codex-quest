import { ColorScheme } from "@/support/colorSupport";
import {
  Drawer,
  Flex,
  List,
  Typography,
  Button,
  Tooltip,
  InputNumber,
  Divider,
  message,
} from "antd";
import classNames from "classnames";
import React from "react";
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";
import {
  ClearOutlined,
  LeftOutlined,
  RightOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { CombatantType } from "@/data/definitions";
import { DiceSvg } from "@/support/svgSupport";

const DiceIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DiceSvg} {...props} />
);

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
  const [turn, setTurn] = React.useState(0);
  const turnTrackerClassNames = classNames(className);
  const onClose = () => {
    setTurnTrackerExpanded(false);
  };
  const advanceTurn = (reverse: boolean) => {
    // refactor needed when data is moved to game sheet?
    if (reverse) {
      if (turn < combatants.length - 1) {
        setTurn(turn + 1);
      } else {
        setTurn(0);
      }
    } else {
      if (turn > 0) {
        setTurn(turn - 1);
      } else {
        setTurn(combatants.length - 1);
      }
    }
  };
  const handleInitiaveChange = (
    item: CombatantType,
    newValue: number | null,
  ) => {
    const newInitiative = newValue ?? 0;
    const updatedCombatants = combatants.map((combatant) => {
      if (combatant.name === item.name) {
        return { ...combatant, initiative: newInitiative };
      }
      return combatant;
    });
    updatedCombatants.sort((a, b) => b.initiative - a.initiative);
    setCombatants(updatedCombatants);
  };
  const handleCombatantRemove = (item: CombatantType) => {
    const updatedCombatants = combatants.filter(
      (combatant) => combatant.name !== item.name,
    );
    message.success(`${item.name} removed from Turn Tracker`);
    setCombatants(updatedCombatants);
  };
  return (
    <Drawer
      className={turnTrackerClassNames}
      open={turnTrackerExpanded}
      onClose={onClose}
      title="Turn Tracker"
      styles={{ header: { background: ColorScheme.SEABUCKTHORN } }}
    >
      <Flex gap={16} justify="space-between" align="center">
        <Tooltip title="Rewind Turn">
          <Button
            onClick={() => advanceTurn(false)}
            disabled={!combatants.length}
            icon={<LeftOutlined />}
          />
        </Tooltip>
        <Tooltip title="Advance Turn">
          <Button
            onClick={() => advanceTurn(true)}
            disabled={!combatants.length}
            icon={<RightOutlined />}
            type="primary"
          />
        </Tooltip>
      </Flex>
      <Divider className="mt-3" />
      <List
        header={
          <Flex justify="space-between" gap={16} align="center">
            <Typography.Text>Combatants</Typography.Text>
            <Flex gap={16}>
              <Tooltip title="Roll Monster Initiative">
                <Button
                  icon={<DiceIcon />}
                  type="text"
                  disabled={!combatants.length}
                  className="[&:disabled_svg]:fill-stone"
                />
              </Tooltip>
              <Tooltip title="Clear combatants">
                <Button
                  icon={<ClearOutlined />}
                  type="text"
                  disabled={!combatants.length}
                  onClick={() => setCombatants([])}
                />
              </Tooltip>
            </Flex>
          </Flex>
        }
        dataSource={combatants}
        renderItem={(item, index) => (
          <List.Item className="relative">
            {turn === index && (
              <div className="w-2 h-2 bg-sushi rounded-full absolute -left-4" />
            )}
            <Flex
              gap={16}
              align="center"
              justify="space-between"
              className="w-full"
            >
              <Flex
                gap={16}
                align="center"
                className="flex-grow truncate text-elipsis text-clip"
              >
                {item.avatar && (
                  <span className="rounded-full bg-rust w-8 h-8 block"></span>
                )}
                <Typography.Text>{item.name}</Typography.Text>
              </Flex>
              <Tooltip title="Remove">
                <Button
                  type="text"
                  icon={<UserDeleteOutlined />}
                  onClick={() => handleCombatantRemove(item)}
                />
              </Tooltip>
              <Tooltip title="Initiative">
                <InputNumber
                  className="w-[60px] box-content"
                  min={0}
                  value={item.initiative}
                  onChange={(e) => handleInitiaveChange(item, e)}
                />
              </Tooltip>
            </Flex>
          </List.Item>
        )}
      ></List>
    </Drawer>
  );
};

export default TurnTracker;
