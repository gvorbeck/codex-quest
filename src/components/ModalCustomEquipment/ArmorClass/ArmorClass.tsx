import { Form, InputNumber } from "antd";
import React from "react";

const ArmorClass: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  return (
    <Form.Item
      label="Armor Class"
      name="armor-class"
      className={className}
      rules={[{ required: true }]}
    >
      <InputNumber />
    </Form.Item>
  );
};

export default ArmorClass;
