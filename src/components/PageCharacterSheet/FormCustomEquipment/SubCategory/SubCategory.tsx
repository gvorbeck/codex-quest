import { Form, Select, SelectProps } from "antd";
import React from "react";
import { equipmentSubCategoryMap } from "@/support/equipmentSupport";
import { slugToTitleCase } from "@/support/stringSupport";

const subCategoryOptions: SelectProps<string>["options"] = Object.keys(
  equipmentSubCategoryMap(),
)
  .sort((a, b) => a.localeCompare(b))
  .map((category) => ({ value: category, label: slugToTitleCase(category) }));

const SubCategory: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  return (
    <Form.Item label="Sub Category" name="sub-category" className={className}>
      <Select options={subCategoryOptions} />
    </Form.Item>
  );
};

export default SubCategory;
