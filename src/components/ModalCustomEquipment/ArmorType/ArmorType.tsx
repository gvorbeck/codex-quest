import { Form, Switch } from "antd";
import React from "react";

interface ArmorTypeProps {}

const ArmorType: React.FC<
  ArmorTypeProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  return (
    <Form.Item
      label="Armor Type"
      name="type"
      className={className}
      rules={[{ required: true }]}
    >
      <Switch
        checkedChildren="Light Armor"
        unCheckedChildren="Heavy Armor"
        defaultChecked
      />
    </Form.Item>
  );
};

export default ArmorType;
