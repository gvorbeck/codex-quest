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
  Switch,
} from "antd";
import ModalCloseIcon from "./ModalCloseIcon/ModalCloseIcon";
import { AddCustomEquipmentModalProps } from "./definitions";
import equipmentItems from "../data/equipment-items.json";
import { slugToTitleCase } from "../components/formatters";
import { useEffect, useState } from "react";
import HomebrewWarning from "../components/HomebrewWarning/HomebrewWarning";
import { useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

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
  character,
  setCharacter,
}: AddCustomEquipmentModalProps) {
  const [formState, setFormState] = useState({
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
  });
  const [prevValue, setPrevValue] = useState(character.equipment);

  const { uid, id } = useParams();

  const updateEquipment = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    if (character.equipment !== prevValue) {
      const docRef = doc(db, "users", uid, "characters", id);

      try {
        await updateDoc(docRef, {
          equipment: character.equipment,
          gold: character.gold,
        });
        setPrevValue(character.equipment);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  useEffect(() => {
    updateEquipment();
  }, [character.equipment, character.gold, character.weight]);

  const onFinish = (values: any) => {
    console.log("Success:", values);
    let newItem;
    switch (values.category) {
      case "ammunition":
        newItem = {
          amount: values.amount,
          name: values.name,
          costValue: values.costValue,
          costCurrency: values.costCurrency,
          weight: values.weight,
          damage: values.damage,
          category: values.category,
        };
        break;
      case "armor-and-shields":
        newItem = {
          AC: values.armorOrShield ? values["armor-ac"] : values["shield-ac"],
          amount: values.amount,
          category: values.category,
          costCurrency: values.costCurrency,
          costValue: values.costValue,
          name: values.name,
          weight: values.weight,
        };
        break;
      case "axes":
      case "hammers-and-maces":
      case "improvised-weapons":
      case "other-weapons":
      case "spears-and-polearms":
        newItem = {
          name: values.name,
          costValue: values.costValue,
          costCurrency: values.costCurrency,
          size: values.size,
          weight: values.weight,
          damage: values.damage,
          category: values.category,
          type: values.type,
          amount: values.amount,
        };
        break;
      case "beasts-of-burden":
        newItem = {
          name: values.name,
          costValue: values.costValue,
          costCurrency: values.costCurrency,
          category: values.category,
          amount: values.amount,
        };
        break;
      case "bows":
      case "slings-and-hurled-weapons":
        newItem = {
          name: values.name,
          costValue: values.costValue,
          costCurrency: values.costCurrency,
          size: values.size,
          weight: values.weight,
          category: values.category,
          type: "missile",
          amount: values.amount,
          damage: values.damage,
        };
        break;
      case "brawling":
      case "chain-and-flail":
      case "swords":
        newItem = {
          name: values.name,
          costValue: values.costValue,
          costCurrency: values.costCurrency,
          size: values.size,
          weight: values.weight,
          damage: values.damage,
          category: values.category,
          type: "melee",
          amount: values.amount,
        };
        break;
      case "daggers":
        newItem = {
          name: values.name,
          costValue: values.costValue,
          costCurrency: values.costCurrency,
          size: values.size,
          weight: values.weight,
          damage: values.damage,
          category: values.category,
          type: "both",
          amount: values.amount,
        };
        break;
      case "items":
        newItem = {
          name: values.name,
          costValue: values.costValue,
          costCurrency: values.costCurrency,
          weight: values.weight,
          category: values.category,
          amount: values.amount,
        };
        break;
      default:
        break;
    }
    console.log(newItem);
  };

  const handleFormChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
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

  const handleSwitchChange = (value: any) => {
    setFormState({
      ...formState,
      armorOrShield: value,
      ac: undefined,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleRadioChange = (event: RadioChangeEvent) => {
    const value = event.target.value;
    setFormState({
      ...formState,
      type: value,
    });
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
              className={`${
                (formState.category === "armor-and-shields" ||
                  formState.category === "beasts-of-burden" ||
                  formState.category === "bows" ||
                  formState.category === "brawling" ||
                  formState.category === "items" ||
                  formState.category === "chain-and-flail" ||
                  formState.category === "daggers" ||
                  formState.category === "slings-and-hurled-weapons") &&
                "hidden"
              }`}
              rules={[
                {
                  required:
                    formState.category !== "armor-and-shields" &&
                    formState.category !== "beasts-of-burden" &&
                    formState.category !== "bows" &&
                    formState.category !== "items" &&
                    formState.category !== "brawling" &&
                    formState.category !== "chain-and-flail" &&
                    formState.category !== "daggers" &&
                    formState.category !== "slings-and-hurled-weapons",
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
                className={`${
                  (formState.category === "armor-and-shields" ||
                    formState.category === "beasts-of-burden" ||
                    formState.category === "bows" ||
                    formState.category === "items") &&
                  "hidden"
                }`}
                rules={[
                  {
                    required:
                      formState.category !== "armor-and-shields" &&
                      formState.category !== "beasts-of-burden" &&
                      formState.category !== "bows" &&
                      formState.category !== "items" &&
                      formState.category !== "slings-and-hurled-weapons",
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
                formState.category !== "armor-and-shields" && "hidden"
              }`}
            >
              <Form.Item
                label="Armor or Shield?"
                name="armorOrShield"
                valuePropName="checked"
                initialValue={formState.armorOrShield}
              >
                <Switch
                  onChange={handleSwitchChange}
                  checkedChildren="Armor"
                  unCheckedChildren="Shield"
                  defaultChecked={formState.armorOrShield}
                />
              </Form.Item>
              <div className="flex gap-4 [&>*]:flex-[0_0_50%]">
                <Form.Item
                  label="AC"
                  name="shield-ac"
                  className={`${formState.armorOrShield && "hidden"}`}
                  rules={[
                    {
                      required:
                        formState.category === "armor-and-shields" &&
                        !formState.armorOrShield,
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
                    !formState.armorOrShield && "hidden"
                  } [&_.ant-input-number]:w-full`}
                  rules={[
                    {
                      required:
                        formState.category === "armor-and-shields" &&
                        formState.armorOrShield,
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
                className={`${
                  (formState.category === "ammunition" ||
                    formState.category === "armor-and-shields" ||
                    formState.category === "beasts-of-burden" ||
                    formState.category === "items") &&
                  "hidden"
                }`}
                rules={[
                  {
                    required:
                      formState.category !== "ammunition" &&
                      formState.category !== "armor-and-shields" &&
                      formState.category !== "beasts-of-burden" &&
                      formState.category !== "items",
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
