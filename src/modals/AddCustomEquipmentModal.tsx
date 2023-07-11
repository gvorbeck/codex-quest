import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
} from "antd";
import ModalCloseIcon from "./ModalCloseIcon/ModalCloseIcon";
import { AddCustomEquipmentModalProps } from "./definitions";
import equipmentItems from "../data/equipment-items.json";
import { slugToTitleCase } from "../components/formatters";
import { ChangeEvent, useState } from "react";
import HomebrewWarning from "../components/HomebrewWarning/HomebrewWarning";

const categoriesSet = new Set(equipmentItems.map((item) => item.category));

const equipmentCategories = Array.from(categoriesSet)
  .map((category) => {
    return { value: category, label: slugToTitleCase(category) };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

export default function AddCustomEquipmentModal({
  isAddCustomEquipmentModalOpen,
  handleCancel,
}: AddCustomEquipmentModalProps) {
  const [name, setName] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCategoryChange = (event: string) => {
    setCategory(event);
  };

  const validDiceNotation = (value: string) => {
    const diceNotationRegex =
      /(\d+)?d(\d+)(([+-]\d+)|([kK]\d+([lLhH])?)|([eE]))?/g;
    return diceNotationRegex.test(value);
  };

  return (
    <Modal
      title="ADD CUSTOM EQUIPMENT"
      open={isAddCustomEquipmentModalOpen}
      onCancel={handleCancel}
      footer={false}
      width={600}
      closeIcon={<ModalCloseIcon />}
    >
      <div className="flex flex-col gap-4">
        <HomebrewWarning homebrew="item" />
        <Form layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            required
            rules={[
              { max: 100, message: "Name must be 100 characters or less" },
            ]}
          >
            <Input value={name} onChange={handleNameChange} />
          </Form.Item>
          <Form.Item label="Category" name="category" required>
            <Select
              onChange={handleCategoryChange}
              options={equipmentCategories}
            />
          </Form.Item>
          <Form.Item
            label="Sub-Category"
            name="sub-category"
            required={category === "general-equipment"}
            className={`${category !== "general-equipment" && "hidden"}`}
          >
            <Select />
          </Form.Item>
          <div className="flex gap-4">
            <Form.Item
              label="Cost"
              name="costValue"
              rules={[{ type: "number", message: "Weight must be a number" }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item label="Currency" name="costCurrency">
              <Select
                onChange={handleChange}
                options={[
                  { value: "gp", label: "gp" },
                  { value: "sp", label: "sp" },
                  { value: "cp", label: "cp" },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Weight"
            name="weight"
            required
            rules={[{ type: "number", message: "Weight must be a number" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Damage"
            name="damage"
            required={true}
            rules={[
              {
                pattern: /(\d+)?d(\d+)(([+-]\d+)|([kK]\d+([lLhH])?)|([eE]))?/g,
                message: "Invalid dice notation",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Armor or Shield?"
            name="armor-or-shield"
            className={`${category !== "armor-and-shields" && "hidden"}`}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Shield AC"
            name="shield-ac"
            required={category === "armor-and-shields"}
            className={`${category !== "armor-and-shields" && "hidden"}`}
            rules={[
              {
                pattern: /[+-]\d/g,
                message: 'Must be a number that starts with "+" or "-"',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Armor AC"
            name="armor-ac"
            required={category === "armor-and-shields"}
            className={`${category !== "armor-and-shields" && "hidden"}`}
            rules={[
              {
                type: "number",
                message: "Must be a number",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Size"
            name="size"
            required={true}
            className={`${
              (category === "ammunition" ||
                category === "armor-and-shields" ||
                category === "beast-of-burden" ||
                category === "items") &&
              "hidden"
            }`}
          >
            <Select
              onChange={handleChange}
              options={[
                { value: "S", label: "S" },
                { value: "M", label: "M" },
                { value: "L", label: "L" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Amount" name="amount">
            <InputNumber />
          </Form.Item>
          <Form.Item label="Purchased?" name="purchased">
            <Checkbox checked />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
