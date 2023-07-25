import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  RadioChangeEvent,
  Select,
} from "antd";
import { useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import CloseIcon from "../components/CloseIcon/CloseIcon";
import { AddCustomEquipmentModalProps } from "./definitions";
import equipmentItems from "../data/equipment-items.json";
import { slugToTitleCase } from "../support/stringSupport";
import { calculateItemCost } from "../support/formatSupport";
import HomebrewWarning from "../components/HomebrewWarning/HomebrewWarning";
import { EquipmentItem } from "../components/EquipmentStore/definitions";
import DOMPurify from "dompurify";

const initialFormState = {
  name: undefined,
  category: undefined,
  subCategory: undefined,
  costValue: undefined,
  costCurrency: "gp",
  armorOrShield: false,
  purchased: true,
  weight: undefined,
  damage: undefined,
  type: "melee",
  ac: undefined,
  size: undefined,
  amount: 1,
};

const categoriesSet = new Set(equipmentItems.map((item) => item.category));

const equipmentCategories = Array.from(categoriesSet)
  .map((category) => {
    return { value: category, label: slugToTitleCase(category) };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

const onFinishFailed = (errorInfo: any) => {
  console.error("Failed:", errorInfo);
};

export default function AddCustomEquipmentModal({
  isAddCustomEquipmentModalOpen,
  handleCancel,
  characterData,
  setCharacterData,
}: AddCustomEquipmentModalProps) {
  const [formState, setFormState] = useState(initialFormState);
  const [prevValue, setPrevValue] = useState(characterData.equipment);

  const { uid, id } = useParams();

  const updateEquipment = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    if (characterData.equipment !== prevValue) {
      const docRef = doc(db, "users", uid, "characters", id);

      try {
        await updateDoc(docRef, {
          equipment: characterData.equipment,
          gold: characterData.gold,
        });
        setPrevValue(characterData.equipment);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  useEffect(() => {
    updateEquipment();
  }, [characterData.equipment, characterData.gold, characterData.weight]);

  const onFinish = (values: any) => {
    // Common properties
    let newItem: EquipmentItem = {
      name: values.name,
      costValue: values.costValue,
      costCurrency: values.costCurrency,
      category: values.category,
      amount: values.amount,
    };

    // Additional properties based on category
    switch (values.category) {
      case "ammunition":
        newItem = {
          ...newItem,
          weight: values.weight,
          damage: values.damage,
        };
        break;
      case "armor":
        newItem = {
          ...newItem,
          AC: values["armor-ac"],
          weight: values.weight,
        };
        break;
      case "shields":
        newItem = {
          ...newItem,
          AC: values["shield-ac"],
          weight: values.weight,
        };
        break;
      case "axes":
      case "hammers-and-maces":
      case "improvised-weapons":
      case "other-weapons":
      case "spears-and-polearms":
        newItem = {
          ...newItem,
          size: values.size,
          weight: values.weight,
          damage: values.damage,
          type: values.type,
        };
        break;
      case "beasts-of-burden":
        // No additional properties
        break;
      case "bows":
      case "slings-and-hurled-weapons":
        newItem = {
          ...newItem,
          size: values.size,
          weight: values.weight,
          type: "missile",
          damage: values.damage,
        };
        break;
      case "brawling":
      case "chain-and-flail":
      case "swords":
        newItem = {
          ...newItem,
          size: values.size,
          weight: values.weight,
          damage: values.damage,
          type: "melee",
        };
        break;
      case "daggers":
        newItem = {
          ...newItem,
          size: values.size,
          weight: values.weight,
          damage: values.damage,
          type: "both",
        };
        break;
      case "items":
        newItem = {
          ...newItem,
          weight: values.weight,
        };
        break;
      default:
        break;
    }

    // Calculate the item cost
    const itemCost = calculateItemCost(newItem);

    // Update the character's equipment and gold
    const updatedEquipment = [...characterData.equipment, newItem];
    const updatedGold = characterData.gold - (values.purchased ? itemCost : 0);

    setCharacterData({
      ...characterData,
      equipment: updatedEquipment,
      gold: updatedGold,
    });

    handleCancel();
    setFormState(initialFormState);
  };

  const handleFormChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: DOMPurify.sanitize(value),
    });
  };

  const handleNumberChange = (
    value: number | string | null,
    fieldName: string
  ): void => {
    const numValue = typeof value === "string" ? Number(value) : value;

    setFormState({
      ...formState,
      [fieldName]: numValue,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleRadioChange = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setFormState({
      ...formState,
      type: value,
    });
  };

  const attackTypeHiddenCategories = [
    "ammunition",
    "armor",
    "shields",
    "beasts-of-burden",
    "bows",
    "brawling",
    "items",
    "chain-and-flail",
    "daggers",
    "slings-and-hurled-weapons",
  ];

  const damageHiddenCategories = [
    "armor",
    "shields",
    "beasts-of-burden",
    "bows",
    "items",
  ];

  const sizeHiddenCategories = [
    "ammunition",
    "armor",
    "shields",
    "beasts-of-burden",
    "items",
  ];

  return (
    <Modal
      title="ADD CUSTOM EQUIPMENT"
      open={isAddCustomEquipmentModalOpen}
      onCancel={handleCancel}
      footer={false}
      width={600}
      closeIcon={<CloseIcon />}
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
              value={formState.name}
              onChange={handleFormChange}
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
              onChange={(value) =>
                value !== undefined && handleSelectChange(value, "category")
              }
              options={equipmentCategories}
              value={formState.category}
            />
          </Form.Item>
          <div className={`${formState.category === undefined && "hidden"}`}>
            <Form.Item
              label="Sub-Category"
              name="sub-category"
              rules={[
                {
                  required: formState.category === "general-equipment",
                  message: "Required",
                },
              ]}
              className={`${
                formState.category !== "general-equipment" && "hidden"
              }`}
            >
              <Select
                onChange={(value) =>
                  value !== undefined &&
                  handleSelectChange(value, "subCategory")
                }
                value={formState.subCategory}
              />
            </Form.Item>
            <div className="flex gap-4">
              <Form.Item
                label="Cost"
                name="costValue"
                rules={[
                  {
                    required: formState.purchased,
                    message: "Required for purchase",
                  },
                  { type: "number", message: "Weight must be a number" },
                ]}
              >
                <InputNumber
                  onChange={(value) => handleNumberChange(value, "costValue")}
                  placeholder="0"
                  value={formState.costValue}
                />
              </Form.Item>
              <Form.Item
                label="Currency"
                name="costCurrency"
                initialValue={formState.costCurrency}
              >
                <Select
                  onChange={(value) =>
                    handleSelectChange(value, "costCurrency")
                  }
                  options={[
                    { value: "gp", label: "gp" },
                    { value: "sp", label: "sp" },
                    { value: "cp", label: "cp" },
                  ]}
                  value={formState.costCurrency}
                />
              </Form.Item>
            </div>
            <Form.Item
              label="Attack Type"
              name="type"
              className={
                attackTypeHiddenCategories.some(
                  (category) => formState.category === category
                )
                  ? "hidden"
                  : ""
              }
              rules={[
                {
                  required: !attackTypeHiddenCategories.some(
                    (category) => formState.category === category
                  ),
                  message: "Required",
                },
              ]}
              initialValue={formState.type}
            >
              <Radio.Group
                value={formState.type}
                onChange={handleRadioChange}
                buttonStyle="solid"
              >
                <Radio.Button value="melee">Melee</Radio.Button>
                <Radio.Button value="missile">Missile</Radio.Button>
                <Radio.Button value="both">Both</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <div className="flex gap-4">
              <Form.Item
                label="Weight"
                name="weight"
                className={`${
                  formState.category === "beasts-of-burden" && "hidden"
                }`}
                rules={[
                  {
                    required: formState.category !== "beasts-of-burden",
                    message: "Required",
                  },
                  {
                    type: "number",
                    message: "Weight must be a number",
                  },
                ]}
              >
                <InputNumber
                  placeholder="0"
                  value={formState.weight}
                  onChange={(value) => handleNumberChange(value, "weight")}
                />
              </Form.Item>
              <Form.Item
                label="Damage"
                name="damage"
                className={
                  damageHiddenCategories.some(
                    (category) => formState.category === category
                  )
                    ? "hidden"
                    : ""
                }
                rules={[
                  {
                    required: !damageHiddenCategories.some(
                      (category) => formState.category === category
                    ),
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
                  value={formState.damage}
                  onChange={handleFormChange}
                />
              </Form.Item>
            </div>
            <div
              className={`${
                formState.category !== "armor" &&
                formState.category !== "shields" &&
                "hidden"
              }`}
            >
              <div className="flex gap-4 [&>*]:flex-[0_0_50%]">
                <Form.Item
                  label="AC"
                  name="shield-ac"
                  className={`${formState.category === "armor" && "hidden"}`}
                  rules={[
                    {
                      required: formState.category === "shields",
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
                    value={formState.ac}
                    onChange={handleFormChange}
                  />
                </Form.Item>
                <Form.Item
                  label="AC"
                  name="armor-ac"
                  className={`${
                    formState.category === "shields" && "hidden"
                  } [&_.ant-input-number]:w-full`}
                  rules={[
                    {
                      required: formState.category === "armor",
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
                    value={Number(formState.ac)}
                    onChange={(value) => handleNumberChange(value, "ac")}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="flex gap-4 justify-between">
              <Form.Item
                label="Size"
                name="size"
                className={
                  sizeHiddenCategories.some(
                    (category) => formState.category === category
                  )
                    ? "hidden"
                    : ""
                }
                rules={[
                  {
                    required: !sizeHiddenCategories.some(
                      (category) => formState.category === category
                    ),
                    message: "Required",
                  },
                ]}
              >
                <Select
                  onChange={(value) =>
                    value !== undefined && handleSelectChange(value, "size")
                  }
                  options={[
                    { value: "S", label: "S" },
                    { value: "M", label: "M" },
                    { value: "L", label: "L" },
                  ]}
                  value={formState.size}
                />
              </Form.Item>
              <Form.Item
                label="Amount"
                name="amount"
                initialValue={1}
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber
                  value={formState.amount}
                  onChange={(value) => handleNumberChange(value, "amount")}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="purchased"
              valuePropName="checked"
              rules={[{ type: "boolean" }]}
              initialValue={formState.purchased}
            >
              <Checkbox
                onChange={(e) =>
                  handleFormChange({
                    target: { name: "purchased", value: e.target.checked },
                  })
                }
              >
                Purchased?
              </Checkbox>
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
