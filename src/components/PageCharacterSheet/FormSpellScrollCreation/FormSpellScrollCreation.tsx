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

interface FormValues {
  spell: string;
  quantity: number;
}

const FormSpellScrollCreation: React.FC<
  FormSpellScrollCreationProps & React.ComponentPropsWithRef<"div">
> = ({ className, handleResetFormDisplay }) => {
  const { character, characterDispatch } =
    React.useContext(CharacterDataContext);
  const [form] = Form.useForm<FormValues>();
  const [selectedSpell, setSelectedSpell] = React.useState<Spell | null>(null);

  const isSpellcrafter = character.class.includes("Spellcrafter");
  const availableSpells = React.useMemo(
    () => character.spells || [],
    [character.spells],
  );

  const getSpellLevel = React.useCallback((spell: Spell): number => {
    return spell.level &&
      typeof spell.level === "object" &&
      "spellcrafter" in spell.level
      ? spell.level.spellcrafter || 1
      : 1;
  }, []);

  const calculateScrollCost = React.useCallback(
    (spell: Spell): number => {
      const level = getSpellLevel(spell);
      return level * level * 25 + level * 10; // (level² × 25) + (level × 10)
    },
    [getSpellLevel],
  );

  const scrollCost = selectedSpell ? calculateScrollCost(selectedSpell) : 0;
  const quantity = Form.useWatch("quantity", form) || 1;
  const totalCost = scrollCost * quantity;
  const canAfford = character.gold >= totalCost;
  const isFormValid = selectedSpell && canAfford;

  const handleSpellChange = (spellName: string) => {
    const spell = availableSpells.find((s) => s.name === spellName);
    setSelectedSpell(spell || null);
  };

  const onFinish = (values: FormValues) => {
    if (!selectedSpell || !isSpellcrafter) return;

    if (character.gold < totalCost) {
      message.error("Insufficient gold to create this scroll!");
      return;
    }

    const scrollName = `Scroll of ${selectedSpell.name}`;
    const existingScrollIndex = character.equipment.findIndex(
      (item) => item.name === scrollName,
    );

    let updatedEquipment: EquipmentItem[];
    let successMessage: string;

    if (existingScrollIndex !== -1) {
      // Update existing scroll quantity
      updatedEquipment = [...character.equipment];
      updatedEquipment[existingScrollIndex] = {
        ...updatedEquipment[existingScrollIndex],
        amount: updatedEquipment[existingScrollIndex].amount + values.quantity,
      };
      successMessage = `Added ${values.quantity}x to existing ${scrollName}! Total: ${updatedEquipment[existingScrollIndex].amount}`;
    } else {
      // Create new scroll item
      const scrollItem: EquipmentItem = {
        name: scrollName,
        costValue: scrollCost,
        costCurrency: "gp",
        weight: 0.1,
        category: EquipmentCategories.GENERAL,
        subCategory: "class-items",
        amount: values.quantity,
        notes: `Spell Level: ${getSpellLevel(selectedSpell)}. Contains the spell "${selectedSpell.name}". Single use consumable. Range: ${selectedSpell.range}, Duration: ${selectedSpell.duration}`,
      };
      updatedEquipment = [...character.equipment, scrollItem];
      successMessage = `Created ${values.quantity}x ${scrollName}!`;
    }

    characterDispatch({
      type: "UPDATE",
      payload: {
        equipment: updatedEquipment,
        gold: parseFloat((character.gold - totalCost).toFixed(2)),
      },
    });

    message.success(successMessage);
    handleResetFormDisplay();
  };

  const spellOptions = React.useMemo(
    () =>
      availableSpells.map((spell) => ({
        label: `${spell.name} (Level ${getSpellLevel(spell)})`,
        value: spell.name,
      })),
    [availableSpells, getSpellLevel],
  );

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
      form={form}
      initialValues={{ quantity: 1 }}
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
        <InputNumber min={1} max={10} />
      </Form.Item>

      {selectedSpell && (
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
                {"Cost per scroll: "}
                {scrollCost} gp
              </Typography.Text>
              <Typography.Text>Total cost: {totalCost} gp</Typography.Text>
              <Typography.Text>
                Time required: {getSpellLevel(selectedSpell)} day(s) per scroll
              </Typography.Text>
              <Typography.Text
                style={{ color: canAfford ? "inherit" : "#ff4d4f" }}
              >
                Available Gold: {character.gold} gp
                {!canAfford && " (Insufficient funds!)"}
              </Typography.Text>
            </Flex>
          }
        />
      )}

      {selectedSpell && !canAfford && (
        <Alert
          type="warning"
          message="Insufficient Gold"
          description={`You need ${totalCost} gp to create ${quantity > 1 ? `${quantity} scrolls` : "this scroll"}, but you only have ${character.gold} gp.`}
          showIcon
        />
      )}

      <Flex justify="space-between">
        <Button onClick={handleResetFormDisplay}>Cancel</Button>
        <Button type="primary" htmlType="submit" disabled={!isFormValid}>
          Create Scroll{quantity > 1 ? `s (${quantity})` : ""}
        </Button>
      </Flex>
    </Form>
  );
};

export default FormSpellScrollCreation;
