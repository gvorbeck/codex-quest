import {
  Button,
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

export default function AddCustomEquipmentModal({
  isAddCustomEquipmentModalOpen,
  handleCancel,
}: AddCustomEquipmentModalProps) {
  const [name, setName] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [subCategory, setSubCategory] = useState<string | undefined>(undefined);
  const [costValue, setCostValue] = useState<number | undefined>(undefined);
  const [costCurrency, setCostCurrency] = useState<string>("gp");
  const [armorOrShield, setArmorOrShield] = useState<boolean>(false);
  const [purchased, setPurchased] = useState<boolean>(true);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [damage, setDamage] = useState<string | undefined>(undefined);
  const [ac, setAc] = useState<string | number | undefined>(undefined);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<number>(1);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCategoryChange = (event: string) => setCategory(event);
  const handleSubCategoryChange = (event: string) => setSubCategory(event);

  const handleCostValueChange = (value: number | null) => {
    setCostValue(value ?? undefined);
  };
  const handleCostCurrencyChange = (event: string) => setCostCurrency(event);

  const handleWeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWeight(Number(event.target.value));
  };

  const handleDamageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDamage(event.target.value);
  };

  const handleSwitchChange = () => {
    setArmorOrShield(!armorOrShield);
    setAc(0);
  };

  const handleShieldAcChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAc(event.target.value);
  };
  const handleArmorAcChange = (value: number | null) => {
    setAc(value ?? undefined);
  };

  const handleSizeChange = (event: string) => setSize(event);

  const handleAmountChange = (value: number | null) => {
    setAmount(value ?? 1);
  };

  const handlePurchaseChange = () => setPurchased(!purchased);

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
        <Form
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Required",
              },
              { max: 100, message: "Name must be 100 characters or less" },
            ]}
          >
            <Input
              value={name}
              onChange={handleNameChange}
              placeholder="Custom Item"
            />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          >
            <Select
              onChange={handleCategoryChange}
              options={equipmentCategories}
              value={category}
            />
          </Form.Item>
          <div className={`${category === undefined && "hidden"}`}>
            <Form.Item
              label="Sub-Category"
              name="sub-category"
              rules={[
                {
                  required: category === "general-equipment",
                  message: "Required",
                },
              ]}
              className={`${category !== "general-equipment" && "hidden"}`}
            >
              <Select onChange={handleSubCategoryChange} value={subCategory} />
            </Form.Item>
            <div className="flex gap-4">
              <Form.Item
                label="Cost"
                name="costValue"
                rules={[
                  { required: purchased, message: "Required for purchase" },
                  { type: "number", message: "Weight must be a number" },
                ]}
              >
                <InputNumber
                  onChange={handleCostValueChange}
                  placeholder="0"
                  value={costValue}
                />
              </Form.Item>
              <Form.Item
                label="Currency"
                name="costCurrency"
                initialValue={costCurrency}
              >
                <Select
                  onChange={handleCostCurrencyChange}
                  options={[
                    { value: "gp", label: "gp" },
                    { value: "sp", label: "sp" },
                    { value: "cp", label: "cp" },
                  ]}
                  value={costCurrency}
                />
              </Form.Item>
            </div>
            <div className="flex gap-4">
              <Form.Item
                label="Weight"
                name="weight"
                className={`${category === "beasts-of-burden" && "hidden"}`}
                rules={[
                  {
                    required: category !== "beasts-of-burden",
                    message: "Required",
                  },
                  {
                    type: "number",
                    message: "Weight must be a number",
                    transform: (value) => Number(value),
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="0"
                  value={weight}
                  onChange={handleWeightChange}
                />
              </Form.Item>
              <Form.Item
                label="Damage"
                name="damage"
                className={`${
                  (category === "armor-and-shields" ||
                    category === "beasts-of-burden" ||
                    category === "bows" ||
                    category === "items") &&
                  "hidden"
                }`}
                rules={[
                  {
                    required:
                      category !== "armor-and-shields" &&
                      category !== "beasts-of-burden" &&
                      category !== "bows" &&
                      category !== "items",
                    message: "Required",
                  },
                  {
                    pattern:
                      /(\d+)?d(\d+)(([+-]\d+)|([kK]\d+([lLhH])?)|([eE]))?/g,
                    message: "Invalid dice notation",
                  },
                ]}
              >
                <Input
                  placeholder="1d10"
                  value={damage}
                  onChange={handleDamageChange}
                />
              </Form.Item>
            </div>
            <div className={`${category !== "armor-and-shields" && "hidden"}`}>
              <Form.Item label="Armor or Shield?" name="armor-or-shield">
                <Switch
                  checked={armorOrShield}
                  onChange={handleSwitchChange}
                  unCheckedChildren="Shield"
                  checkedChildren="Armor"
                />
              </Form.Item>
              <div className="flex gap-4 [&>*]:flex-[0_0_50%]">
                <Form.Item
                  label="AC"
                  name="shield-ac"
                  className={`${armorOrShield && "hidden"}`}
                  rules={[
                    {
                      required:
                        category === "armor-and-shields" && !armorOrShield,
                      message: "Required",
                    },
                    {
                      pattern: /[+-]\d/g,
                      message: 'Must be a number that starts with "+" or "-"',
                    },
                  ]}
                >
                  <Input
                    placeholder="+1"
                    value={ac}
                    onChange={handleShieldAcChange}
                  />
                </Form.Item>
                <Form.Item
                  label="AC"
                  name="armor-ac"
                  className={`${
                    !armorOrShield && "hidden"
                  } [&_.ant-input-number]:w-full`}
                  rules={[
                    {
                      required:
                        category === "armor-and-shields" && armorOrShield,
                      message: "Required",
                    },
                    {
                      type: "number",
                      message: "Must be a number",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="11"
                    value={Number(ac)}
                    onChange={handleArmorAcChange}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="flex gap-4 justify-between">
              <Form.Item
                label="Size"
                name="size"
                className={`${
                  (category === "ammunition" ||
                    category === "armor-and-shields" ||
                    category === "beasts-of-burden" ||
                    category === "items") &&
                  "hidden"
                }`}
                rules={[
                  {
                    required:
                      category !== "ammunition" &&
                      category !== "armor-and-shields" &&
                      category !== "beasts-of-burden" &&
                      category !== "items",
                    message: "Required",
                  },
                ]}
              >
                <Select
                  onChange={handleSizeChange}
                  options={[
                    { value: "S", label: "S" },
                    { value: "M", label: "M" },
                    { value: "L", label: "L" },
                  ]}
                  value={size}
                />
              </Form.Item>
              <Form.Item
                label="Amount"
                name="amount"
                initialValue={1}
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber value={amount} onChange={handleAmountChange} />
              </Form.Item>
            </div>
            <Form.Item label="Purchased?" name="purchased">
              <Checkbox checked={purchased} onChange={handlePurchaseChange} />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
