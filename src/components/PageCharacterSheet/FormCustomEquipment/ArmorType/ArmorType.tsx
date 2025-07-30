import { Form, Select, SelectProps } from "antd";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ArmorTypeProps {}

const ArmorType: React.FC<
  ArmorTypeProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const options: SelectProps["options"] = [
    { value: 0, label: "No Armor or Magic Leather" },
    { value: 1, label: "Leather Armor or Magic Metal" },
    { value: 2, label: "Metal Armor" },
  ];
  return (
    <Form.Item
      label="Armor Type"
      name="type"
      className={className}
      rules={[{ required: true }]}
    >
      <Select options={options} />
    </Form.Item>
  );
};

export default ArmorType;
