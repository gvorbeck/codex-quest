import { Form, Input } from "antd";
import React from "react";
import { equipmentNames } from "@/support/equipmentSupport";

const Name: React.FC<React.ComponentPropsWithRef<"div">> = ({ className }) => {
  const validateName = async (_: unknown, value: string) => {
    if (equipmentNames.includes(value)) {
      throw new Error("This name already exists.");
    }
  };

  return (
    <Form.Item
      className={className}
      label="Name"
      name="name"
      rules={[
        { required: true, message: "Please input a name!" },
        { validator: validateName },
      ]}
    >
      <Input />
    </Form.Item>
  );
};

export default Name;
