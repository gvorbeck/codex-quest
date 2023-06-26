import { Checkbox, InputNumber, Space } from "antd";
import { EquipmentCheckboxProps } from "./definitions";
import { useEffect, useState } from "react";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { EquipmentItem } from "../EquipmentStore/definitions";

export default function EquipmentCheckbox({
  disabled,
  item,
  className,
  onCheckboxCheck,
  onAmountChange,
  playerHasItem,
  equipmentItemDescription,
}: EquipmentCheckboxProps) {
  const [isChecked, setIsChecked] = useState(playerHasItem);
  const [amount, setAmount] = useState(item.amount || 1);

  const handleCheckboxChange = (
    e: CheckboxChangeEvent,
    item: EquipmentItem
  ) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onCheckboxCheck(item, checked);
    if (!checked) setAmount(1);
  };

  const handleInputChange = (value: number | null, item: EquipmentItem) => {
    setAmount(value || 1);
    onAmountChange({ ...item, amount: value || 0 });
  };

  useEffect(() => {
    setAmount(item.amount || 1);
  }, [item.amount]);

  return (
    <Space direction="vertical" className={className}>
      <Checkbox
        disabled={disabled}
        onChange={(e: CheckboxChangeEvent) => handleCheckboxChange(e, item)}
        checked={playerHasItem}
      >
        {equipmentItemDescription}
      </Checkbox>
      <InputNumber
        min={1}
        defaultValue={1}
        onChange={(value: number | null) => handleInputChange(value, item)}
        disabled={!isChecked}
        className="ml-6"
        value={amount}
      />
    </Space>
  );
}
