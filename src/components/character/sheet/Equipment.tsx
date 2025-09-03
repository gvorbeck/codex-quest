import { useState, useCallback, useMemo } from "react";
import { useModal } from "@/hooks/useModal";
import { SectionWrapper } from "@/components/ui/layout";
import { Card, Badge, Typography } from "@/components/ui/design-system";
import { Button, Switch, TextInput, TextArea, Select, NumberInput, FormField } from "@/components/ui/inputs";
import { Modal } from "@/components/modals";
import { Accordion } from "@/components/ui/layout";
import { EquipmentSelector } from "@/components/character/management";
import { CustomEquipmentModal } from "@/components/modals";
import { Icon } from "@/components/ui/display/Icon";
import { SIZE_STYLES } from "@/constants/designTokens";
import { cleanEquipmentArray, ensureEquipmentAmount } from "@/utils/characterCalculations";
import type { Character, Equipment as EquipmentItem } from "@/types/character";

interface EquipmentProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onEquipmentChange?: (equipment: EquipmentItem[]) => void;
}

export default function Equipment({
  character,
  className = "",
  size = "md",
  editable = false,
  onEquipmentChange,
}: EquipmentProps) {
  const { isOpen: showSelector, toggle: toggleSelector } = useModal();
  const { isOpen: showCustomModal, open: openCustomModal, close: closeCustomModal } = useModal();
  const [editingItem, setEditingItem] = useState<{
    item: EquipmentItem;
    index: number;
  } | null>(null);
  const [editForm, setEditForm] = useState<EquipmentItem | null>(null);
  const currentSize = SIZE_STYLES[size];
  
  // Performance optimization: Only show search for larger equipment inventories
  const SEARCH_THRESHOLD = 8; // Show search bar when equipment count exceeds this

  // Shared helper function for adding equipment to inventory
  const addEquipmentToInventory = useCallback((newEquipment: EquipmentItem) => {
    if (!onEquipmentChange) return;

    // Clean equipment array first, then work with clean data
    const cleanedEquipment = cleanEquipmentArray(character.equipment);
    const existingIndex = cleanedEquipment.findIndex(
      (item) => item.name === newEquipment.name
    );

    if (existingIndex >= 0) {
      // Increase amount of existing item
      const updatedEquipment = [...cleanedEquipment];
      const existingItem = updatedEquipment[existingIndex];
      
      if (existingItem) {
        updatedEquipment[existingIndex] = {
          ...existingItem,
          amount: existingItem.amount + newEquipment.amount,
        };
      }
      onEquipmentChange(updatedEquipment);
    } else {
      // Add new item with proper amount to cleaned equipment array
      const equipmentToAdd = ensureEquipmentAmount(newEquipment);
      
      onEquipmentChange([...cleanedEquipment, equipmentToAdd]);
    }
  }, [character.equipment, onEquipmentChange]);

  const handleEquipmentAdd = (newEquipment: EquipmentItem) => {
    // Ensure we're adding at least 1 item (EquipmentSelector sends items with amount: 0)
    const equipmentToAdd = { ...newEquipment, amount: Math.max(1, newEquipment.amount) };
    addEquipmentToInventory(equipmentToAdd);
    // Don't close selector anymore - let user add multiple items
  };

  const handleCustomEquipmentAdd = (newEquipment: EquipmentItem) => {
    addEquipmentToInventory(newEquipment);
    closeCustomModal();
  };

  const handleEquipmentRemove = useCallback(
    (index: number) => {
      if (!onEquipmentChange) return;

      const updatedEquipment = [...character.equipment];
      const item = updatedEquipment[index];
      
      if (!item) return;

      if (item.amount > 1) {
        // Decrease amount by 1
        updatedEquipment[index] = {
          ...item,
          amount: item.amount - 1
        };
      } else {
        // Remove item completely if amount is 1 or less
        updatedEquipment.splice(index, 1);
      }

      onEquipmentChange(updatedEquipment);
    },
    [character.equipment, onEquipmentChange]
  );

  const handleEquipmentEdit = useCallback(
    (index: number) => {
      const item = character.equipment[index];
      if (!item) return;

      setEditingItem({ item, index });
      setEditForm({ ...item });
    },
    [character.equipment]
  );

  const handleEditSave = useCallback(() => {
    if (!editForm || editingItem === null || !onEquipmentChange) return;

    const updatedEquipment = [...character.equipment];
    updatedEquipment[editingItem.index] = editForm;
    onEquipmentChange(updatedEquipment);

    setEditingItem(null);
    setEditForm(null);
  }, [editForm, editingItem, character.equipment, onEquipmentChange]);

  const handleEditCancel = useCallback(() => {
    setEditingItem(null);
    setEditForm(null);
  }, []);

  // Utility functions for equipment type checking
  const isArmorItem = useCallback((item: EquipmentItem) => 
    item.category?.toLowerCase().includes("armor") ||
    (item.AC !== undefined &&
      !item.category?.toLowerCase().includes("shield"))
  , []);

  const isShieldItem = useCallback((item: EquipmentItem) => 
    item.category?.toLowerCase().includes("shield")
  , []);

  const isWearableItem = useCallback((item: EquipmentItem) => 
    isArmorItem(item) || isShieldItem(item)
  , [isArmorItem, isShieldItem]);

  const updateEditForm = useCallback(
    (field: keyof EquipmentItem, value: string | number) => {
      if (!editForm) return;
      setEditForm({ ...editForm, [field]: value });
    },
    [editForm]
  );

  const toggleWearing = useCallback(
    (index: number) => {
      if (!onEquipmentChange) return;

      const updatedEquipment = [...character.equipment];
      const item = updatedEquipment[index];

      if (!item) return;

      if (isWearableItem(item)) {
        const newWearingState = !item.wearing;

        if (newWearingState) {
          // If we're equipping this item, unequip any other item of the same type
          if (isArmorItem(item)) {
            // Unequip any currently worn armor
            updatedEquipment.forEach((equipItem, i) => {
              if (i !== index && equipItem.wearing && isArmorItem(equipItem)) {
                updatedEquipment[i] = { ...equipItem, wearing: false };
              }
            });
          } else if (isShieldItem(item)) {
            // Unequip any currently worn shield
            updatedEquipment.forEach((equipItem, i) => {
              if (i !== index && equipItem.wearing && isShieldItem(equipItem)) {
                updatedEquipment[i] = { ...equipItem, wearing: false };
              }
            });
          }
        }

        // Toggle the current item's wearing state
        updatedEquipment[index] = {
          ...item,
          wearing: newWearingState,
        };

        onEquipmentChange(updatedEquipment);
      }
    },
    [character.equipment, onEquipmentChange, isWearableItem, isArmorItem, isShieldItem]
  );

  const formatWeight = useCallback((weight: number, amount: number) => {
    const totalWeight = weight * amount;
    return totalWeight > 0 ? `${Math.round(totalWeight * 100) / 100} lbs` : "—";
  }, []);

  const formatCost = useCallback(
    (costValue: number, costCurrency: string, amount: number) => {
      const totalCost = costValue * amount;
      return `${totalCost} ${costCurrency}`;
    },
    []
  );

  // Prepare equipment items for the Accordion component (memoized for performance)
  const equipmentForAccordion = useMemo(() => {
    const cleanedEquipment = cleanEquipmentArray(character.equipment);
    return cleanedEquipment.map((item) => ({
      ...item,
      originalIndex: character.equipment.findIndex(origItem => origItem === item),
      category: item.category || "Other",
    }));
  }, [character.equipment]);

  // Render function for individual equipment items in the accordion
  const renderEquipmentItem = useCallback(
    (item: EquipmentItem & { originalIndex: number }) => {
      return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          {/* Item Info */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <Typography
                variant="body"
                color="primary"
                weight="medium"
                className="flex-1 flex items-center gap-2"
              >
                {item.name}
                {item.wearing && (
                  <Badge
                    variant="success"
                    size="sm"
                    aria-label="Currently equipped"
                  >
                    Equipped
                  </Badge>
                )}
              </Typography>
              {item.amount > 1 && (
                <Badge variant="secondary" size="sm">
                  × {item.amount}
                </Badge>
              )}
            </div>

            {/* Item Description */}
            {item.description && (
              <div className="mb-3">
                <Typography
                  variant="bodySmall"
                  color="muted"
                  className="italic leading-relaxed"
                >
                  {item.description}
                </Typography>
              </div>
            )}

            {/* Item Statistics */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1">
                <Icon name="coin" size="xs" aria-hidden={true} />
                {formatCost(item.costValue, item.costCurrency, item.amount)}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="weight" size="xs" aria-hidden={true} />
                {formatWeight(item.weight, item.amount)}
              </span>
              {item.damage && (
                <span className="flex items-center gap-1">
                  <Icon name="damage" size="xs" aria-hidden={true} />
                  {item.damage}
                  {item.twoHandedDamage && ` / ${item.twoHandedDamage}`}
                </span>
              )}
              {item.AC && (
                <span className="flex items-center gap-1">
                  <Icon name="shield" size="xs" aria-hidden={true} />
                  AC {item.AC}
                </span>
              )}
            </div>
          </div>

          {/* Equipment Controls */}
          {editable && (
            <div className="flex flex-col gap-3 sm:min-w-[140px]">
              {/* Wearing Switch for armor and shields */}
              {isWearableItem(item) && (
                <Switch
                  label="Wearing"
                  checked={!!item.wearing}
                  onCheckedChange={() => toggleWearing(item.originalIndex)}
                  size="sm"
                  aria-label={`Toggle wearing ${item.name}`}
                />
              )}

              {/* Edit button */}
              <Button
                onClick={() => handleEquipmentEdit(item.originalIndex)}
                variant="secondary"
                size="sm"
                className="text-blue-400 hover:!text-blue-200 hover:bg-blue-900/30"
                aria-label={`Edit ${item.name}`}
              >
                Edit
              </Button>

              {/* Remove button */}
              <Button
                onClick={() => handleEquipmentRemove(item.originalIndex)}
                variant="secondary"
                size="sm"
                className="text-red-400 hover:!text-red-200 hover:bg-red-900/30"
                aria-label={`Remove ${item.name}`}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      );
    },
    [
      editable,
      toggleWearing,
      handleEquipmentEdit,
      handleEquipmentRemove,
      formatCost,
      formatWeight,
      isWearableItem,
    ]
  );

  return (
    <SectionWrapper
      title={
        <div className="flex gap-2 items-center justify-between w-full">
          <span>Equipment</span>
          {editable && (
            <div className="flex gap-2">
              <Button
                onClick={toggleSelector}
                variant="secondary"
                size="sm"
                aria-expanded={showSelector}
                aria-controls="equipment-selector"
              >
                {showSelector ? "Hide Shop" : "Add Equipment"}
              </Button>
              <Button
                onClick={openCustomModal}
                variant="primary"
                size="sm"
                aria-label="Create custom equipment"
              >
                Create Custom
              </Button>
            </div>
          )}
        </div>
      }
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        {/* Equipment Selector */}
        {showSelector && (
          <div id="equipment-selector" className="mb-6">
            <EquipmentSelector
              character={character}
              onEquipmentAdd={handleEquipmentAdd}
            />
          </div>
        )}

        {/* Equipment List */}
        {cleanEquipmentArray(character.equipment).length === 0 ? (
          <Card variant="standard" className="text-center py-8">
            <Typography variant="body" color="secondary" className="mb-4">
              No equipment found
            </Typography>
            {editable && (
              <Typography variant="bodySmall" color="muted">
                Click "Add Equipment" to browse available gear or "Create
                Custom" to make your own
              </Typography>
            )}
          </Card>
        ) : (
          <Accordion
            items={equipmentForAccordion}
            sortBy="category"
            searchPlaceholder="Search equipment..."
            renderItem={renderEquipmentItem}
            showSearch={cleanEquipmentArray(character.equipment).length > SEARCH_THRESHOLD} // Only show search if there are many items
            showCounts={true}
          />
        )}

        {/* Custom Equipment Modal */}
        <CustomEquipmentModal
          isOpen={showCustomModal}
          onClose={closeCustomModal}
          onEquipmentAdd={handleCustomEquipmentAdd}
        />

        {/* Edit Equipment Modal */}
        {editingItem && editForm && (
          <Modal
            isOpen={true}
            onClose={handleEditCancel}
            title={`Edit ${editingItem.item.name}`}
            size="md"
          >
            <div className="space-y-4">
              {/* Name */}
              <FormField label="Name">
                <TextInput
                  value={editForm.name}
                  onChange={(value) => updateEditForm("name", value)}
                  className="w-full"
                />
              </FormField>

              {/* Amount */}
              <FormField label="Amount">
                <NumberInput
                  value={editForm.amount}
                  onChange={(value) => updateEditForm("amount", value || 1)}
                  minValue={1}
                  step={1}
                  className="w-full"
                />
              </FormField>

              {/* Cost */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Cost Value">
                  <NumberInput
                    value={editForm.costValue}
                    onChange={(value) => updateEditForm("costValue", value || 0)}
                    minValue={0}
                    step={0.01}
                    className="w-full"
                  />
                </FormField>
                <Select
                  label="Currency"
                  value={editForm.costCurrency}
                  onValueChange={(value) => updateEditForm("costCurrency", value as "gp" | "sp" | "cp")}
                  options={[
                    { value: "gp", label: "gp" },
                    { value: "sp", label: "sp" },
                    { value: "cp", label: "cp" }
                  ]}
                  className="w-full"
                />
              </div>

              {/* Weight */}
              <FormField label="Weight (lbs)">
                <NumberInput
                  value={editForm.weight}
                  onChange={(value) => updateEditForm("weight", value || 0)}
                  minValue={0}
                  step={0.1}
                  className="w-full"
                />
              </FormField>

              {/* Category */}
              <FormField label="Category">
                <TextInput
                  value={editForm.category || ""}
                  onChange={(value) => updateEditForm("category", value)}
                  className="w-full"
                />
              </FormField>

              {/* Description */}
              <FormField label="Description">
                <TextArea
                  value={editForm.description || ""}
                  onChange={(value) => updateEditForm("description", value)}
                  placeholder="Optional description for this equipment..."
                  rows={3}
                  className="w-full"
                />
              </FormField>

              {/* Weapon properties */}
              {(editForm.damage || editForm.twoHandedDamage) && (
                <div className="border-t border-zinc-600 pt-4">
                  <Typography variant="body" weight="medium" className="mb-3">
                    Weapon Properties
                  </Typography>

                  <div className="grid grid-cols-2 gap-3">
                    {editForm.damage && (
                      <FormField label="Damage">
                        <TextInput
                          value={editForm.damage}
                          onChange={(value) => updateEditForm("damage", value)}
                          className="w-full"
                        />
                      </FormField>
                    )}

                    {editForm.twoHandedDamage && (
                      <FormField label="Two-Handed Damage">
                        <TextInput
                          value={editForm.twoHandedDamage}
                          onChange={(value) =>
                            updateEditForm("twoHandedDamage", value)
                          }
                          className="w-full"
                        />
                      </FormField>
                    )}
                  </div>
                </div>
              )}

              {/* Armor properties */}
              {(editForm.AC || editForm.missileAC) && (
                <div className="border-t border-zinc-600 pt-4">
                  <Typography variant="body" weight="medium" className="mb-3">
                    Armor Properties
                  </Typography>

                  <div className="grid grid-cols-1 gap-3">
                    {editForm.AC && (
                      <FormField label="Armor Class">
                        <TextInput
                          value={editForm.AC.toString()}
                          onChange={(value) => updateEditForm("AC", value)}
                          className="w-full"
                        />
                      </FormField>
                    )}

                    {editForm.missileAC && (
                      <FormField label="Missile AC">
                        <TextInput
                          value={editForm.missileAC}
                          onChange={(value) =>
                            updateEditForm("missileAC", value)
                          }
                          className="w-full"
                        />
                      </FormField>
                    )}
                  </div>
                </div>
              )}

              {/* Modal actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-600">
                <Button
                  onClick={handleEditCancel}
                  variant="secondary"
                  size="md"
                >
                  Cancel
                </Button>
                <Button onClick={handleEditSave} variant="primary" size="md">
                  Save Changes
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </SectionWrapper>
  );
}
