import React from "react";
import {
  Button,
  Flex,
  Form,
  Select,
  InputNumber,
  Typography,
  message,
  Alert,
} from "antd";
import { CharacterDataContext } from "@/store/CharacterContext";
import { EquipmentItem, Spell, EquipmentCategories } from "@/data/definitions";

interface FormSpellScrollCreationProps {
  handleResetFormDisplay: () => void;
}

const FormSpellScrollCreation: React.FC<
  FormSpellScrollCreationProps & React.ComponentPropsWithRef<"div">
> = ({ className, handleResetFormDisplay }) => {
  const { character, characterDispatch } =
    React.useContext(CharacterDataContext);
  const [form] = Form.useForm();
  const [selectedSpell, setSelectedSpell] = React.useState<Spell | null>(null);
  const [scrollCost, setScrollCost] = React.useState<number>(0);
  const [quantity, setQuantity] = React.useState<number>(1);

  // Check if character is a spellcrafter
  const isSpellcrafter = character.class.includes("Spellcrafter");

  // Get available spells that the character knows
  const availableSpells = character.spells || [];

  // Calculate scroll creation cost based on spell level
  const calculateScrollCost = (spell: Spell): number => {
    if (!spell) return 0;

    // Base cost formula: spell level squared * 25gp + materials
    const spellLevel = getSpellLevel(spell);
    const baseCost = Math.pow(spellLevel, 2) * 25;
    const materialCost = spellLevel * 10; // Additional material costs

    return baseCost + materialCost;
  };

  // Get spell level for the spellcrafter class
  const getSpellLevel = (spell: Spell): number => {
    if (
      spell.level &&
      typeof spell.level === "object" &&
      "spellcrafter" in spell.level
    ) {
      return spell.level.spellcrafter || 1;
    }
    return 1;
  };

  // Calculate time required (in days)
  const calculateTimeRequired = (spell: Spell): number => {
    const spellLevel = getSpellLevel(spell);
    return spellLevel; // 1 day per spell level
  };

  const handleSpellChange = (spellName: string) => {
    const spell = availableSpells.find((s) => s.name === spellName);
    if (spell) {
      setSelectedSpell(spell);
      const cost = calculateScrollCost(spell);
      setScrollCost(cost);
    }
  };

  const handleQuantityChange = (value: number | null) => {
    setQuantity(value || 1);
  };

  interface FormValues {
    spell: string;
    quantity: number;
  }

  const onFinish = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    console.log("Selected spell:", selectedSpell);
    console.log("Is spellcrafter:", isSpellcrafter);

    if (!selectedSpell || !isSpellcrafter) {
      console.log("Early return - missing spell or not spellcrafter");
      return;
    }

    const scrollName = `Scroll of ${selectedSpell.name}`;
    const scrollItem: EquipmentItem = {
      name: scrollName,
      costValue: scrollCost,
      costCurrency: "gp",
      weight: 0.1,
      category: EquipmentCategories.GENERAL,
      subCategory: "class-items",
      amount: values.quantity || 1,
      notes: `Spell Level: ${getSpellLevel(selectedSpell)}. Contains the spell "${selectedSpell.name}". Single use consumable. Range: ${selectedSpell.range}, Duration: ${selectedSpell.duration}`,
    };

    const totalCost = scrollCost * (values.quantity || 1);
    console.log("Total cost:", totalCost, "Character gold:", character.gold);

    if (character.gold < totalCost) {
      message.error("Insufficient gold to create this scroll!");
      return;
    }

    console.log("Creating scroll item:", scrollItem);

    characterDispatch({
      type: "UPDATE",
      payload: {
        equipment: [...character.equipment, scrollItem],
        gold: parseFloat((character.gold - totalCost).toFixed(2)),
      },
    });

    message.success(`Created ${values.quantity || 1}x ${scrollName}!`);
    handleResetFormDisplay();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
    console.log("Form validation failed:", errorInfo);
    console.log("Error fields:", errorInfo.errorFields);
    errorInfo.errorFields?.forEach((field: any) => {
      console.log(`Field ${field.name} errors:`, field.errors);
    });
  };

  const spellOptions = availableSpells.map((spell) => ({
    label: `${spell.name} (Level ${getSpellLevel(spell)})`,
    value: spell.name,
  }));

  if (!isSpellcrafter) {
    return (
      <Alert
        message="Spellcrafter Required"
        description="Only Spellcrafters can create spell scrolls."
        type="error"
        showIcon
      />
    );
  }

  return (
    <Form
      className={className}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={form}
      initialValues={{
        quantity: 1,
      }}
      name="spell-scroll-creation"
    >
      <Typography.Title level={4}>Create Spell Scroll</Typography.Title>

      <Form.Item
        label="Select Spell"
        name="spell"
        rules={[{ required: true, message: "Please select a spell" }]}
      >
        <Select
          placeholder="Choose a spell to inscribe"
          options={spellOptions}
          onChange={handleSpellChange}
        />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[
          {
            required: true,
            type: "number",
            min: 1,
            message: "Must create at least 1 scroll",
          },
        ]}
      >
        <InputNumber min={1} max={10} onChange={handleQuantityChange} />
      </Form.Item>

      {selectedSpell && (
        <Flex vertical gap={8}>
          <Alert
            type="info"
            message={
              <Flex vertical gap={4}>
                <Typography.Text strong>
                  {"Spell: "}
                  {selectedSpell.name} (Level {getSpellLevel(selectedSpell)})
                </Typography.Text>

                <Typography.Text>
                  {"Range: "}
                  {selectedSpell.range} | Duration: {selectedSpell.duration}
                </Typography.Text>

                <Typography.Text>
                  Cost per scroll: {scrollCost} gp
                </Typography.Text>

                <Typography.Text>
                  Total cost: {scrollCost * quantity} gp
                </Typography.Text>

                <Typography.Text>
                  Time required: {calculateTimeRequired(selectedSpell)} day(s)
                  per scroll
                </Typography.Text>

                <Typography.Text>
                  Available Gold: {character.gold} gp
                </Typography.Text>
              </Flex>
            }
          />
        </Flex>
      )}

      <Flex justify="space-between">
        <Button onClick={handleResetFormDisplay}>Cancel</Button>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!selectedSpell || character.gold < scrollCost * quantity}
        >
          Create Scroll{quantity > 1 ? `s (${quantity})` : ""}
        </Button>
      </Flex>
    </Form>
  );
};

export default FormSpellScrollCreation;
