import { Form, Select } from "antd";
import React from "react";
import { equipmentSizes } from "@/support/characterSupport";

const Size: React.FC<React.ComponentPropsWithRef<"div">> = ({ className }) => {
  return (
    <Form.Item
      label="Size"
      name="size"
      className={className}
      rules={[{ required: true }]}
    >
      <Select options={equipmentSizes} />
    </Form.Item>
  );
};

export default Size;
