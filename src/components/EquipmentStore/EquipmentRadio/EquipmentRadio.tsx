import { Radio } from "antd";
import { EquipmentRadioProps } from "./definitions";

export default function EquipmentRadio({
  item,
  equipmentItemDescription,
  disabled,
  inputDisabled,
}: EquipmentRadioProps) {
  return (
    <Radio value={item.name} disabled={disabled || inputDisabled}>
      {equipmentItemDescription}
    </Radio>
  );
}
