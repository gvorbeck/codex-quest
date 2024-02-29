import { CombatantType } from "@/data/definitions";
import { useTurnTracker } from "@/hooks/useTurnTacker";
import { PlusOutlined, UserDeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Input,
  InputNumber,
  Popconfirm,
  Tag,
  Tooltip,
  message,
  theme,
} from "antd";
import React from "react";

interface CombatantControlsProps {
  combatant: CombatantType;
  combatants: CombatantType[];
  setCombatants: (combatants: CombatantType[]) => void;
  index: number;
}

const CombatantControls: React.FC<
  CombatantControlsProps & React.ComponentPropsWithRef<"div">
> = ({ className, combatant, combatants, setCombatants, index }) => {
  const {
    handleInitiaveChange,
    handleShowInput,
    handleInputChange,
    handleInputConfirm,
    sortCombatants,
    inputValue,
    inputVisible,
    inputRef,
  } = useTurnTracker(combatants, setCombatants);
  const [, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
    borderColor: token.colorFill,
  };
  const handleCombatantRemove = (item: CombatantType) => {
    const updatedCombatants = combatants.filter(
      (combatant) => combatant.name !== item.name,
    );
    message.success(`${item.name} removed from Turn Tracker`);
    setCombatants(updatedCombatants);
  };

  React.useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputVisible]);
  return (
    <>
      {contextHolder}
      <Flex gap={16} align="center" className={className}>
        <Tooltip title="Initiative">
          <InputNumber
            className="w-[60px] box-content"
            min={0}
            value={combatant.initiative}
            onChange={(newValue) => handleInitiaveChange(combatant, newValue)}
            onBlur={sortCombatants}
            onPressEnter={sortCombatants}
          />
        </Tooltip>
        <Popconfirm
          title="Remove this character?"
          onConfirm={() => handleCombatantRemove(combatant)}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<UserDeleteOutlined />} />
        </Popconfirm>
        {inputVisible === combatant.name ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={() => handleInputConfirm(index)}
            onPressEnter={() => handleInputConfirm(index)}
          />
        ) : (
          <Tag
            onClick={() => handleShowInput(combatant.name)}
            style={tagPlusStyle}
          >
            <PlusOutlined /> New Tag
          </Tag>
        )}
      </Flex>
    </>
  );
};

export default CombatantControls;
