import { Form, Select, SelectProps } from "antd";
import React from "react";
import { equipmentCategoryMap } from "@/support/equipmentSupport";
import { slugToTitleCase } from "@/support/stringSupport";

interface CategoryProps {
  handleCategoryChange: (value: string) => void;
}

const categoryOptions: SelectProps<string>["options"] = Object.keys(
  equipmentCategoryMap(),
)
  .sort((a, b) => a.localeCompare(b))
  .map((category) => ({ value: category, label: slugToTitleCase(category) }));

const Category: React.FC<
  CategoryProps & React.ComponentPropsWithRef<"div">
> = ({ className, handleCategoryChange }) => {
  return (
    <Form.Item
      label="Category"
      name="category"
      className={className}
      rules={[{ required: true }]}
    >
      <Select options={categoryOptions} onChange={handleCategoryChange} />
    </Form.Item>
  );
};

export default Category;
