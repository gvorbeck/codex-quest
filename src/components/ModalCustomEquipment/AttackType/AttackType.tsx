import { Form, Select } from "antd";
import React from "react";
import { AttackTypes } from "@/support/stringSupport";

interface AttackTypeProps {
  disabled?: boolean;
}

const attackOptions = [
  {
    value: AttackTypes.MELEE,
    label:
      AttackTypes.MELEE.charAt(0).toUpperCase() + AttackTypes.MELEE.slice(1),
  },
  {
    value: AttackTypes.MISSILE,
    label:
      AttackTypes.MISSILE.charAt(0).toUpperCase() +
      AttackTypes.MISSILE.slice(1),
  },
  {
    value: AttackTypes.BOTH,
    label: AttackTypes.BOTH.charAt(0).toUpperCase() + AttackTypes.BOTH.slice(1),
  },
];

const AttackType: React.FC<
  AttackTypeProps & React.ComponentPropsWithRef<"div">
> = ({ className, disabled }) => {
  return (
    <Form.Item
      label="Attack"
      name="attack"
      className={className}
      rules={[{ required: true }]}
    >
      <Select
        options={attackOptions}
        dropdownStyle={{ width: "auto" }}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default AttackType;
