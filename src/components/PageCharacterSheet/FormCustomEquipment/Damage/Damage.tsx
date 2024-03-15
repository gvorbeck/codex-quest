import { Form, Input } from "antd";
import React from "react";

const Damage: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  return (
    <Form.Item
      label="Damage"
      name="damage"
      className={className}
      rules={[
        {
          pattern: /(\d+)?d(\d+)(([+-]\d+)|([kK]\d+([lLhH])?)|([eE]))?/g,
          message: "Invalid dice notation",
          required: true,
        },
      ]}
      tooltip={{ title: "Enter this weapon's damage in dice notation." }}
    >
      <Input placeholder="1d6" />
    </Form.Item>
  );
};

export default Damage;
