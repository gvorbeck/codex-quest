import { useState, useCallback } from "react";
import { Modal } from "../base";
import {
  Button,
  Select,
  TextInput,
  TextArea,
  NumberInput,
  FormField,
} from "@/components/ui/inputs";
import { Typography } from "@/components/ui/design-system";
import type { Equipment } from "@/types/character";

interface CustomEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEquipmentAdd: (equipment: Equipment) => void;
}

const EQUIPMENT_CATEGORIES = [
  { value: "weapon", label: "Weapon" },
  { value: "armor", label: "Armor" },
  { value: "shield", label: "Shield" },
  { value: "tool", label: "Tool" },
  { value: "gear", label: "Adventuring Gear" },
  { value: "container", label: "Container" },
  { value: "trade-good", label: "Trade Good" },
  { value: "animal", label: "Animal/Mount" },
  { value: "other", label: "Other" },
];

const WEAPON_TYPES = [
  { value: "melee", label: "Melee" },
  { value: "missile", label: "Missile/Ranged" },
  { value: "both", label: "Both" },
];

const WEAPON_SIZES = [
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
];

const CURRENCIES = [
  { value: "gp", label: "Gold Pieces (gp)" },
  { value: "sp", label: "Silver Pieces (sp)" },
  { value: "cp", label: "Copper Pieces (cp)" },
];

export default function CustomEquipmentModal({
  isOpen,
  onClose,
  onEquipmentAdd,
}: CustomEquipmentModalProps) {
  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: "",
    costValue: 0,
    costCurrency: "gp",
    weight: 0,
    category: "",
    amount: 1,
    description: "",
  });

  const handleFieldChange = useCallback(
    (
      field: keyof Equipment,
      value: string | number | [number, number, number] | string[]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setFormData({
      name: "",
      costValue: 0,
      costCurrency: "gp",
      weight: 0,
      category: "",
      amount: 1,
      description: "",
    });
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (!formData.name || !formData.category) return;

    // Build equipment object, only including defined values
    const newEquipment: Equipment = {
      name: formData.name,
      costValue: formData.costValue || 0,
      costCurrency: formData.costCurrency || "gp",
      weight: formData.weight || 0,
      category: formData.category,
      amount: formData.amount || 1,
      wearing: false,
    };

    // Add optional fields only if they have values
    if (formData.subCategory) {
      newEquipment.subCategory = formData.subCategory;
    }

    if (formData.description) {
      newEquipment.description = formData.description;
    }

    // Weapon properties - only add if they have values
    if (formData.size) {
      newEquipment.size = formData.size;
    }

    if (formData.damage) {
      newEquipment.damage = formData.damage;
    }

    if (formData.twoHandedDamage) {
      newEquipment.twoHandedDamage = formData.twoHandedDamage;
    }

    if (formData.type) {
      newEquipment.type = formData.type;
    }

    if (formData.range && formData.range.some((r) => r > 0)) {
      newEquipment.range = formData.range;
    }

    if (
      formData.ammo &&
      formData.ammo.length > 0 &&
      formData.ammo.some((a) => a.trim())
    ) {
      newEquipment.ammo = formData.ammo.filter((a) => a.trim());
    }

    // Armor properties - only add if they have values
    if (formData.AC !== undefined && formData.AC !== "") {
      newEquipment.AC = formData.AC;
    }

    if (formData.missileAC) {
      newEquipment.missileAC = formData.missileAC;
    }

    // Animal properties - only add if they have values
    if (formData.lowCapacity && formData.lowCapacity > 0) {
      newEquipment.lowCapacity = formData.lowCapacity;
    }

    if (formData.capacity && formData.capacity > 0) {
      newEquipment.capacity = formData.capacity;
    }

    if (formData.animalWeight && formData.animalWeight > 0) {
      newEquipment.animalWeight = formData.animalWeight;
    }

    // Other properties - only add if they have values
    if (formData.gold && formData.gold > 0) {
      newEquipment.gold = formData.gold;
    }

    onEquipmentAdd(newEquipment);
    handleReset();
  }, [formData, onEquipmentAdd, handleReset]);

  const handleCancel = handleReset;

  const isWeapon = formData.category === "weapon";
  const isArmor =
    formData.category === "armor" || formData.category === "shield";
  const isAnimal = formData.category === "animal";
  const isValid = formData.name && formData.category;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create Custom Equipment"
      size="lg"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <Typography variant="body" weight="medium" className="text-zinc-200">
            Basic Information
          </Typography>

          {/* Name */}
          <FormField label="Name" required>
            <TextInput
              value={formData.name || ""}
              onChange={(value) => handleFieldChange("name", value)}
              placeholder="Enter equipment name..."
            />
          </FormField>

          {/* Category */}
          <Select
            label="Category"
            options={EQUIPMENT_CATEGORIES}
            value={formData.category || ""}
            onValueChange={(value) => handleFieldChange("category", value)}
            placeholder="Select a category..."
            required
          />

          {/* Sub-Category */}
          <FormField label="Sub-Category (Optional)">
            <TextInput
              value={formData.subCategory || ""}
              onChange={(value) => handleFieldChange("subCategory", value)}
              placeholder="e.g., Longsword, Chain Mail, etc."
            />
          </FormField>

          {/* Description */}
          <FormField label="Description (Optional)">
            <TextArea
              value={formData.description || ""}
              onChange={(value) => handleFieldChange("description", value)}
              placeholder="Describe this equipment's appearance, properties, or special features..."
              rows={3}
            />
          </FormField>
        </div>

        {/* Basic Properties */}
        <div className="space-y-4 border-t border-zinc-600 pt-4">
          <Typography variant="body" weight="medium" className="text-zinc-200">
            Basic Properties
          </Typography>

          {/* Amount */}
          <FormField label="Amount">
            <NumberInput
              value={formData.amount || 1}
              onChange={(value) => handleFieldChange("amount", value || 1)}
              placeholder="1"
              minValue={1}
            />
          </FormField>

          {/* Cost */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Cost Value">
              <NumberInput
                value={formData.costValue || 0}
                onChange={(value) => handleFieldChange("costValue", value || 0)}
                placeholder="0"
                minValue={0}
                step={1}
              />
            </FormField>
            <Select
              label="Currency"
              options={CURRENCIES}
              value={formData.costCurrency || "gp"}
              onValueChange={(value) =>
                handleFieldChange("costCurrency", value as "gp" | "sp" | "cp")
              }
            />
          </div>

          {/* Weight */}
          <FormField label="Weight (lbs)">
            <NumberInput
              value={formData.weight || 0}
              onChange={(value) => handleFieldChange("weight", value || 0)}
              placeholder="0"
              minValue={0}
              step={0.1}
            />
          </FormField>
        </div>

        {/* Weapon-specific fields */}
        {isWeapon && (
          <div className="space-y-4 border-t border-zinc-600 pt-4">
            <Typography
              variant="body"
              weight="medium"
              className="text-zinc-200"
            >
              Weapon Properties
            </Typography>

            {/* Weapon Type */}
            <Select
              label="Weapon Type"
              options={WEAPON_TYPES}
              value={formData.type || ""}
              onValueChange={(value) =>
                handleFieldChange("type", value as "melee" | "missile" | "both")
              }
              placeholder="Select weapon type..."
            />

            {/* Weapon Size */}
            <Select
              label="Size"
              options={WEAPON_SIZES}
              value={formData.size || ""}
              onValueChange={(value) =>
                handleFieldChange("size", value as "S" | "M" | "L")
              }
              placeholder="Select weapon size..."
            />

            {/* Damage */}
            <FormField label="Damage">
              <TextInput
                value={formData.damage || ""}
                onChange={(value) => handleFieldChange("damage", value)}
                placeholder="e.g., 1d8, 1d6+1, etc."
              />
            </FormField>

            {/* Two-Handed Damage */}
            <FormField label="Two-Handed Damage (Optional)">
              <TextInput
                value={formData.twoHandedDamage || ""}
                onChange={(value) =>
                  handleFieldChange("twoHandedDamage", value)
                }
                placeholder="e.g., 1d10 (if different when used two-handed)"
              />
            </FormField>

            {/* Range (for missile weapons) */}
            {(formData.type === "missile" || formData.type === "both") && (
              <FormField label="Range (Short/Medium/Long in feet)">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">
                      Short
                    </label>
                    <NumberInput
                      value={formData.range?.[0] || 0}
                      onChange={(value) => {
                        const numValue = value || 0;
                        const currentRange = formData.range || [0, 0, 0];
                        handleFieldChange("range", [
                          numValue,
                          currentRange[1],
                          currentRange[2],
                        ] as [number, number, number]);
                      }}
                      placeholder="0"
                      minValue={0}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">
                      Medium
                    </label>
                    <NumberInput
                      value={formData.range?.[1] || 0}
                      onChange={(value) => {
                        const numValue = value || 0;
                        const currentRange = formData.range || [0, 0, 0];
                        handleFieldChange("range", [
                          currentRange[0],
                          numValue,
                          currentRange[2],
                        ] as [number, number, number]);
                      }}
                      placeholder="0"
                      minValue={0}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">
                      Long
                    </label>
                    <NumberInput
                      value={formData.range?.[2] || 0}
                      onChange={(value) => {
                        const numValue = value || 0;
                        const currentRange = formData.range || [0, 0, 0];
                        handleFieldChange("range", [
                          currentRange[0],
                          currentRange[1],
                          numValue,
                        ] as [number, number, number]);
                      }}
                      placeholder="0"
                      minValue={0}
                    />
                  </div>
                </div>
              </FormField>
            )}

            {/* Ammunition */}
            {(formData.type === "missile" || formData.type === "both") && (
              <FormField 
                label="Ammunition Types (Optional)"
                hint="Separate multiple types with commas"
              >
                <TextInput
                  value={formData.ammo?.join(", ") || ""}
                  onChange={(value) =>
                    handleFieldChange(
                      "ammo",
                      value ? value.split(", ").map((s) => s.trim()) : []
                    )
                  }
                  placeholder="e.g., arrows, bolts, stones"
                />
              </FormField>
            )}
          </div>
        )}

        {/* Armor-specific fields */}
        {isArmor && (
          <div className="space-y-4 border-t border-zinc-600 pt-4">
            <Typography
              variant="body"
              weight="medium"
              className="text-zinc-200"
            >
              Armor Properties
            </Typography>

            {/* Armor Class */}
            <FormField label="Armor Class (AC)">
              <TextInput
                value={formData.AC?.toString() || ""}
                onChange={(value) => {
                  // Try to parse as number, otherwise store as string
                  const numValue = parseInt(value);
                  handleFieldChange("AC", isNaN(numValue) ? value : numValue);
                }}
                placeholder="e.g., 14, 12+Dex, etc."
              />
            </FormField>

            {/* Missile AC */}
            <FormField label="Missile AC (Optional)">
              <TextInput
                value={formData.missileAC || ""}
                onChange={(value) => handleFieldChange("missileAC", value)}
                placeholder="e.g., 13 (if different from normal AC)"
              />
            </FormField>
          </div>
        )}

        {/* Animal/Mount specific fields */}
        {isAnimal && (
          <div className="space-y-4 border-t border-zinc-600 pt-4">
            <Typography
              variant="body"
              weight="medium"
              className="text-zinc-200"
            >
              Animal/Mount Properties
            </Typography>

            {/* Animal Weight */}
            <FormField label="Animal Weight (lbs)">
              <NumberInput
                value={formData.animalWeight || 0}
                onChange={(value) =>
                  handleFieldChange("animalWeight", value || 0)
                }
                placeholder="0"
                minValue={0}
              />
            </FormField>

            {/* Load Capacities */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Low Capacity (lbs)">
                <NumberInput
                  value={formData.lowCapacity || 0}
                  onChange={(value) =>
                    handleFieldChange("lowCapacity", value || 0)
                  }
                  placeholder="0"
                  minValue={0}
                />
              </FormField>
              <FormField label="Max Capacity (lbs)">
                <NumberInput
                  value={formData.capacity || 0}
                  onChange={(value) =>
                    handleFieldChange("capacity", value || 0)
                  }
                  placeholder="0"
                  minValue={0}
                />
              </FormField>
            </div>
          </div>
        )}

        {/* Special fields for equipment with gold value */}
        {formData.category === "trade-good" && (
          <div className="space-y-4 border-t border-zinc-600 pt-4">
            <Typography
              variant="body"
              weight="medium"
              className="text-zinc-200"
            >
              Trade Good Properties
            </Typography>

            <FormField label="Gold Value (if applicable)">
              <NumberInput
                value={formData.gold || 0}
                onChange={(value) => handleFieldChange("gold", value || 0)}
                placeholder="Gold pieces value"
                minValue={0}
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-zinc-600 mt-6">
        <Button onClick={handleCancel} variant="secondary" size="md">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="md"
          disabled={!isValid}
        >
          Create Equipment
        </Button>
      </div>
    </Modal>
  );
}
