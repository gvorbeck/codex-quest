import { CombatantType } from "@/data/definitions";
import { useTurnTracker } from "@/hooks/useTurnTacker";
import { PlusOutlined, UserDeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Input,
  InputNumber,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import React from "react";

interface CombatantControlsProps {
  combatant: CombatantType;
  combatants: CombatantType[];
  setCombatants: (combatants: CombatantType[]) => void;
}

const CombatantControls: React.FC<
  CombatantControlsProps & React.ComponentPropsWithRef<"div">
> = ({ className, combatant, combatants, setCombatants }) => {
  const {
    handleCombatantRemove,
    handleInitiaveChange,
    handleShowInput,
    handleInputChange,
    handleInputConfirm,
    sortCombatants,
    inputValue,
    inputVisible,
    inputRef,
  } = useTurnTracker(combatants, setCombatants);
  const { token } = theme.useToken();
  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
    borderColor: token.colorFill,
  };

  React.useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputVisible]);
  return (
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
      <Tooltip title="Remove">
        <Button
          icon={<UserDeleteOutlined />}
          onClick={() => handleCombatantRemove(combatant)}
        />
      </Tooltip>
      {inputVisible === combatant.name ? (
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
          onClick={() => handleShowInput(combatant.name)}
          style={tagPlusStyle}
        >
          <PlusOutlined /> New Tag
        </Tag>
      )}
      {combatant.ac && (
        <Typography.Text type="secondary">AC: {combatant.ac}</Typography.Text>
      )}
    </Flex>
  );
};

export default CombatantControls;
