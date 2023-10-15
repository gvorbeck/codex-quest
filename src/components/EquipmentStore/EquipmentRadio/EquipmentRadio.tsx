import { Radio } from "antd";
import { EquipmentItem } from "../../../data/definitions";
import { ReactElement } from "react";

type EquipmentRadioProps = {
  item: EquipmentItem;
  equipmentItemDescription: ReactElement;
  disabled?: boolean;
  inputDisabled: boolean;
};

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
