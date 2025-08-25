import { useState, useCallback } from "react";
import { Modal } from "@/components/ui/feedback";
import { Button, Select, TextInput, TextArea } from "@/components/ui/inputs";
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

  const handleFieldChange = useCallback((field: keyof Equipment, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

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
    
    if (formData.range && formData.range.some(r => r > 0)) {
      newEquipment.range = formData.range;
    }
    
    if (formData.ammo && formData.ammo.length > 0 && formData.ammo.some(a => a.trim())) {
      newEquipment.ammo = formData.ammo.filter(a => a.trim());
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
  }, [formData, onEquipmentAdd]);

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

  const handleCancel = handleReset;

  const isWeapon = formData.category === "weapon";
  const isArmor = formData.category === "armor" || formData.category === "shield";
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
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Name *
            </label>
            <TextInput
              value={formData.name || ""}
              onChange={(value) => handleFieldChange("name", value)}
              placeholder="Enter equipment name..."
              required
            />
          </div>

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
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Sub-Category (Optional)
            </label>
            <TextInput
              value={formData.subCategory || ""}
              onChange={(value) => handleFieldChange("subCategory", value)}
              placeholder="e.g., Longsword, Chain Mail, etc."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Description (Optional)
            </label>
            <TextArea
              value={formData.description || ""}
              onChange={(value) => handleFieldChange("description", value)}
              placeholder="Describe this equipment's appearance, properties, or special features..."
              rows={3}
            />
          </div>
        </div>

        {/* Basic Properties */}
        <div className="space-y-4 border-t border-zinc-600 pt-4">
          <Typography variant="body" weight="medium" className="text-zinc-200">
            Basic Properties
          </Typography>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Amount
            </label>
            <TextInput
              type="number"
              value={formData.amount?.toString() || "1"}
              onChange={(value) => handleFieldChange("amount", parseInt(value) || 1)}
              placeholder="1"
            />
          </div>

          {/* Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Cost Value
              </label>
              <TextInput
                type="number"
                value={formData.costValue?.toString() || "0"}
                onChange={(value) => handleFieldChange("costValue", parseFloat(value) || 0)}
                placeholder="0"
              />
            </div>
            <Select
              label="Currency"
              options={CURRENCIES}
              value={formData.costCurrency || "gp"}
              onValueChange={(value) => handleFieldChange("costCurrency", value as "gp" | "sp" | "cp")}
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Weight (lbs)
            </label>
            <TextInput
              type="number"
              value={formData.weight?.toString() || "0"}
              onChange={(value) => handleFieldChange("weight", parseFloat(value) || 0)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Weapon-specific fields */}
        {isWeapon && (
          <div className="space-y-4 border-t border-zinc-600 pt-4">
            <Typography variant="body" weight="medium" className="text-zinc-200">
              Weapon Properties
            </Typography>

            {/* Weapon Type */}
            <Select
              label="Weapon Type"
              options={WEAPON_TYPES}
              value={formData.type || ""}
              onValueChange={(value) => handleFieldChange("type", value as "melee" | "missile" | "both")}
              placeholder="Select weapon type..."
            />

            {/* Weapon Size */}
            <Select
              label="Size"
              options={WEAPON_SIZES}
              value={formData.size || ""}
              onValueChange={(value) => handleFieldChange("size", value as "S" | "M" | "L")}
              placeholder="Select weapon size..."
            />

            {/* Damage */}
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Damage
              </label>
              <TextInput
                value={formData.damage || ""}
                onChange={(value) => handleFieldChange("damage", value)}
                placeholder="e.g., 1d8, 1d6+1, etc."
              />
            </div>

            {/* Two-Handed Damage */}
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Two-Handed Damage (Optional)
              </label>
              <TextInput
                value={formData.twoHandedDamage || ""}
                onChange={(value) => handleFieldChange("twoHandedDamage", value)}
                placeholder="e.g., 1d10 (if different when used two-handed)"
              />
            </div>

            {/* Range (for missile weapons) */}
            {(formData.type === "missile" || formData.type === "both") && (
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Range (Short/Medium/Long in feet)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Short</label>
                    <TextInput
                      type="number"
                      value={formData.range?.[0]?.toString() || ""}
                      onChange={(value) => {
                        const numValue = parseInt(value) || 0;
                        const currentRange = formData.range || [0, 0, 0];
                        handleFieldChange("range", [numValue, currentRange[1], currentRange[2]] as [number, number, number]);
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Medium</label>
                    <TextInput
                      type="number"
                      value={formData.range?.[1]?.toString() || ""}
                      onChange={(value) => {
                        const numValue = parseInt(value) || 0;
                        const currentRange = formData.range || [0, 0, 0];
                        handleFieldChange("range", [currentRange[0], numValue, currentRange[2]] as [number, number, number]);
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Long</label>
                    <TextInput
                      type="number"
                      value={formData.range?.[2]?.toString() || ""}
                      onChange={(value) => {
                        const numValue = parseInt(value) || 0;
                        const currentRange = formData.range || [0, 0, 0];
                        handleFieldChange("range", [currentRange[0], currentRange[1], numValue] as [number, number, number]);
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Ammunition */}
            {(formData.type === "missile" || formData.type === "both") && (
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Ammunition Types (Optional)
                </label>
                <TextInput
                  value={formData.ammo?.join(", ") || ""}
                  onChange={(value) => handleFieldChange("ammo", value ? value.split(", ").map(s => s.trim()) : [])}
                  placeholder="e.g., arrows, bolts, stones"
                />
                <p className="text-xs text-zinc-400 mt-1">Separate multiple types with commas</p>
              </div>
            )}
          </div>
        )}

        {/* Armor-specific fields */}
        {isArmor && (
          <div className="space-y-4 border-t border-zinc-600 pt-4">
            <Typography variant="body" weight="medium" className="text-zinc-200">
              Armor Properties
            </Typography>

            {/* Armor Class */}
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Armor Class (AC)
              </label>
              <TextInput
                value={formData.AC?.toString() || ""}
                onChange={(value) => {
                  // Try to parse as number, otherwise store as string
                  const numValue = parseInt(value);
                  handleFieldChange("AC", isNaN(numValue) ? value : numValue);
                }}
                placeholder="e.g., 14, 12+Dex, etc."
              />
            </div>

            {/* Missile AC */}
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Missile AC (Optional)
              </label>
              <TextInput
                value={formData.missileAC || ""}
                onChange={(value) => handleFieldChange("missileAC", value)}
                placeholder="e.g., 13 (if different from normal AC)"
              />
            </div>
          </div>
        )}

        {/* Animal/Mount specific fields */}
        {isAnimal && (
          <div className="space-y-4 border-t border-zinc-600 pt-4">
            <Typography variant="body" weight="medium" className="text-zinc-200">
              Animal/Mount Properties
            </Typography>

            {/* Animal Weight */}
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Animal Weight (lbs)
              </label>
              <TextInput
                type="number"
                value={formData.animalWeight?.toString() || ""}
                onChange={(value) => handleFieldChange("animalWeight", parseInt(value) || 0)}
                placeholder="0"
              />
            </div>

            {/* Load Capacities */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Low Capacity (lbs)
                </label>
                <TextInput
                  type="number"
                  value={formData.lowCapacity?.toString() || ""}
                  onChange={(value) => handleFieldChange("lowCapacity", parseInt(value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Max Capacity (lbs)
                </label>
                <TextInput
                  type="number"
                  value={formData.capacity?.toString() || ""}
                  onChange={(value) => handleFieldChange("capacity", parseInt(value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Special fields for equipment with gold value */}
        {formData.category === "trade-good" && (
          <div className="space-y-4 border-t border-zinc-600 pt-4">
            <Typography variant="body" weight="medium" className="text-zinc-200">
              Trade Good Properties
            </Typography>

            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Gold Value (if applicable)
              </label>
              <TextInput
                type="number"
                value={formData.gold?.toString() || ""}
                onChange={(value) => handleFieldChange("gold", parseInt(value) || 0)}
                placeholder="Gold pieces value"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-zinc-600 mt-6">
        <Button
          onClick={handleCancel}
          variant="secondary"
          size="md"
        >
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