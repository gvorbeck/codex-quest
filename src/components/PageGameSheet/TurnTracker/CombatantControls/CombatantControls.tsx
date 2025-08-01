import { CombatantType } from "@/data/definitions";
import { useRoundTracker } from "@/hooks/useRoundTracker";
import { PlusOutlined } from "@ant-design/icons";
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
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";
import TrackerRemoveSvg from "@/assets/svg/TrackerRemoveSvg";

interface CombatantControlsProps {
  combatant: CombatantType;
  combatants: CombatantType[];
  setCombatants: (combatants: CombatantType[]) => void;
  index: number;
}

const TrackerRemoveIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={TrackerRemoveSvg} {...props} />
);

const CombatantControls: React.FC<
  CombatantControlsProps & React.ComponentPropsWithRef<"div">
> = ({ className, combatant, combatants, setCombatants, index }) => {
  const {
    handleInitiativeChange,
    handleShowInput,
    handleInputChange,
    handleInputConfirm,
    sortCombatants,
    inputValue,
    inputVisible,
    inputRef,
  } = useRoundTracker(combatants, setCombatants);
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
    message.success(`${item.name} removed from Round Tracker`);
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
            onChange={(newValue) => handleInitiativeChange(combatant, newValue)}
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
          <Tooltip title="Remove from Round Tracker" placement="bottom">
            <Button
              className="[&:hover_svg]:fill-seaBuckthorn"
              icon={<TrackerRemoveIcon />}
            />
          </Tooltip>
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
