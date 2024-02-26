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
  Tag,
  Input,
  InputRef,
  theme,
} from "antd";
import classNames from "classnames";
import React from "react";
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";
import {
  ClearOutlined,
  LeftOutlined,
  PlusOutlined,
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
  const [inputVisible, setInputVisible] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const inputRef = React.useRef<InputRef>(null);
  const turnTrackerClassNames = classNames(className);
  const { token } = theme.useToken();
  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue) {
      const updatedCombatants = combatants.map((combatant) => {
        if (combatant.name === inputVisible) {
          // Compare with inputVisible which now holds the name
          return { ...combatant, tags: [...combatant.tags, inputValue] };
        }
        return combatant;
      });
      setCombatants(updatedCombatants);
    }
    setInputVisible(null); // Hide the input
    setInputValue("");
  };
  const handleClose = (removedTag: string, combatant: string) => {
    const updatedCombatants = combatants.map((item) => {
      if (item.name === combatant) {
        return {
          ...item,
          tags: item.tags.filter((tag) => tag !== removedTag),
        };
      }
      return item;
    });
    setCombatants(updatedCombatants);
  };
  const showInput = (name: string) => {
    setInputVisible(name);
  };

  React.useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
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
              <div className="w-2 h-2 bg-sushi rounded-full absolute -left-4 top-6" />
            )}
            <Flex gap={8} justify="space-between" className="w-full" vertical>
              <Flex
                gap={16}
                align="center"
                className="flex-grow truncate text-elipsis text-clip"
              >
                {item.avatar && (
                  <span className="rounded-full bg-rust w-8 h-8 block"></span>
                )}
                <Typography.Text className="leading-8">
                  {item.name}
                </Typography.Text>
              </Flex>
              {!!item.tags.length && (
                <Flex gap={8}>
                  {item.tags.map((tag) => (
                    <Tag
                      closable
                      onClose={(e) => {
                        e.preventDefault();
                        handleClose(tag, item.name);
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </Flex>
              )}
              <Flex gap={16} align="center">
                <Tooltip title="Initiative">
                  <InputNumber
                    className="w-[60px] box-content"
                    min={0}
                    value={item.initiative}
                    onChange={(e) => handleInitiaveChange(item, e)}
                  />
                </Tooltip>
                <Tooltip title="Remove">
                  <Button
                    type="text"
                    icon={<UserDeleteOutlined />}
                    onClick={() => handleCombatantRemove(item)}
                  />
                </Tooltip>
                {inputVisible === item.name ? (
                  <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                  />
                ) : (
                  <Tag
                    onClick={() => showInput(item.name)}
                    style={tagPlusStyle}
                  >
                    <PlusOutlined /> New Tag
                  </Tag>
                )}
              </Flex>
            </Flex>
          </List.Item>
        )}
      ></List>
    </Drawer>
  );
};

export default TurnTracker;
