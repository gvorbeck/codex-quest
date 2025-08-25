import { useState, useCallback } from "react";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { Card, Badge, Typography } from "@/components/ui/design-system";
import { Button, Switch, TextInput, TextArea } from "@/components/ui/inputs";
import { Modal } from "@/components/ui/feedback";
import { Accordion } from "@/components/ui/layout";
import { EquipmentSelector } from "@/components/character/management";
import { Icon } from "@/components/ui/display/Icon";
import { SIZE_STYLES } from "@/constants/designTokens";
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
  const [showSelector, setShowSelector] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: EquipmentItem; index: number } | null>(null);
  const [editForm, setEditForm] = useState<EquipmentItem | null>(null);
  const currentSize = SIZE_STYLES[size];

  const handleEquipmentAdd = (newEquipment: EquipmentItem) => {
    if (!onEquipmentChange) return;

    // Check if this equipment already exists in the character's inventory
    const existingIndex = character.equipment.findIndex(
      (item) => item.name === newEquipment.name
    );

    if (existingIndex >= 0) {
      // Increase amount of existing item
      const updatedEquipment = [...character.equipment];
      const existingItem = updatedEquipment[existingIndex];
      if (existingItem) {
        updatedEquipment[existingIndex] = {
          ...existingItem,
          amount: existingItem.amount + newEquipment.amount,
        };
      }
      onEquipmentChange(updatedEquipment);
    } else {
      // Add new item to inventory
      onEquipmentChange([...character.equipment, newEquipment]);
    }

    setShowSelector(false);
  };

  const handleEquipmentRemove = useCallback((index: number) => {
    if (!onEquipmentChange) return;

    const updatedEquipment = character.equipment.filter((_, i) => i !== index);
    onEquipmentChange(updatedEquipment);
  }, [character.equipment, onEquipmentChange]);

  const handleEquipmentEdit = useCallback((index: number) => {
    const item = character.equipment[index];
    if (!item) return;

    setEditingItem({ item, index });
    setEditForm({ ...item });
  }, [character.equipment]);

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

  const updateEditForm = useCallback((field: keyof EquipmentItem, value: string | number) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
  }, [editForm]);


  const toggleWearing = useCallback((index: number) => {
    if (!onEquipmentChange) return;

    const updatedEquipment = [...character.equipment];
    const item = updatedEquipment[index];
    
    if (!item) return;

    // Determine item type based on category and properties
    const isArmor = item.category?.toLowerCase().includes('armor') || 
                   (item.AC !== undefined && !item.category?.toLowerCase().includes('shield'));
    const isShield = item.category?.toLowerCase().includes('shield');
    
    if (isArmor || isShield) {
      const newWearingState = !item.wearing;
      
      if (newWearingState) {
        // If we're equipping this item, unequip any other item of the same type
        if (isArmor) {
          // Unequip any currently worn armor
          updatedEquipment.forEach((equipItem, i) => {
            if (i !== index && equipItem.wearing) {
              const otherIsArmor = equipItem.category?.toLowerCase().includes('armor') || 
                                  (equipItem.AC !== undefined && !equipItem.category?.toLowerCase().includes('shield'));
              if (otherIsArmor) {
                updatedEquipment[i] = { ...equipItem, wearing: false };
              }
            }
          });
        } else if (isShield) {
          // Unequip any currently worn shield
          updatedEquipment.forEach((equipItem, i) => {
            if (i !== index && equipItem.wearing && equipItem.category?.toLowerCase().includes('shield')) {
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
  }, [character.equipment, onEquipmentChange]);

  const formatWeight = useCallback((weight: number, amount: number) => {
    const totalWeight = weight * amount;
    return totalWeight > 0 ? `${totalWeight} lbs` : "—";
  }, []);

  const formatCost = useCallback((costValue: number, costCurrency: string, amount: number) => {
    const totalCost = costValue * amount;
    return `${totalCost} ${costCurrency}`;
  }, []);

  // Prepare equipment items for the Accordion component
  const equipmentForAccordion = character.equipment.map((item, index) => ({
    ...item,
    originalIndex: index,
    category: item.category || "Other",
  }));

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
              {(() => {
                const isArmor = item.category?.toLowerCase().includes('armor') || 
                               (item.AC !== undefined && !item.category?.toLowerCase().includes('shield'));
                const isShield = item.category?.toLowerCase().includes('shield');
                
                if (isArmor || isShield) {
                  return (
                    <Switch
                      label="Wearing"
                      checked={!!item.wearing}
                      onCheckedChange={() => toggleWearing(item.originalIndex)}
                      size="sm"
                      aria-label={`Toggle wearing ${item.name}`}
                    />
                  );
                }
                return null;
              })()}

              {/* Edit button */}
              <Button
                onClick={() => handleEquipmentEdit(item.originalIndex)}
                variant="secondary"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                aria-label={`Edit ${item.name}`}
              >
                Edit
              </Button>

              {/* Remove button */}
              <Button
                onClick={() => handleEquipmentRemove(item.originalIndex)}
                variant="secondary"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                aria-label={`Remove ${item.name}`}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      );
    },
    [editable, toggleWearing, handleEquipmentEdit, handleEquipmentRemove, formatCost, formatWeight]
  );

  return (
    <CharacterSheetSectionWrapper
      title={
        <div className="flex items-center justify-between w-full">
          <span>Equipment</span>
          {editable && (
            <Button
              onClick={() => setShowSelector(!showSelector)}
              variant="secondary"
              size="sm"
              aria-expanded={showSelector}
              aria-controls="equipment-selector"
              className="ml-2"
            >
              {showSelector ? "Hide Shop" : "Add Equipment"}
            </Button>
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
        {character.equipment.length === 0 ? (
          <Card variant="standard" className="text-center py-8">
            <Typography variant="body" color="secondary" className="mb-4">
              No equipment found
            </Typography>
            {editable && (
              <Typography variant="bodySmall" color="muted">
                Click "Add Equipment" to start shopping for gear
              </Typography>
            )}
          </Card>
        ) : (
          <Accordion
            items={equipmentForAccordion}
            sortBy="category"
            searchPlaceholder="Search equipment..."
            renderItem={renderEquipmentItem}
            showSearch={character.equipment.length > 5} // Only show search if there are many items
            showCounts={true}
          />
        )}

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
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Name
                </label>
                <TextInput
                  value={editForm.name}
                  onChange={(value) => updateEditForm('name', value)}
                  className="w-full"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  min="1"
                  value={editForm.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditForm('amount', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>

              {/* Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">
                    Cost Value
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.costValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditForm('costValue', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">
                    Currency
                  </label>
                  <select
                    value={editForm.costCurrency}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateEditForm('costCurrency', e.target.value as 'gp' | 'sp' | 'cp')}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  >
                    <option value="gp">gp</option>
                    <option value="sp">sp</option>
                    <option value="cp">cp</option>
                  </select>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={editForm.weight}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditForm('weight', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Category
                </label>
                <TextInput
                  value={editForm.category || ''}
                  onChange={(value) => updateEditForm('category', value)}
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Description
                </label>
                <TextArea
                  value={editForm.description || ''}
                  onChange={(value) => updateEditForm('description', value)}
                  placeholder="Optional description for this equipment..."
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Weapon properties */}
              {(editForm.damage || editForm.twoHandedDamage) && (
                <div className="border-t border-zinc-600 pt-4">
                  <Typography variant="body" weight="medium" className="mb-3">
                    Weapon Properties
                  </Typography>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {editForm.damage && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-200 mb-2">
                          Damage
                        </label>
                        <TextInput
                          value={editForm.damage}
                          onChange={(value) => updateEditForm('damage', value)}
                          className="w-full"
                        />
                      </div>
                    )}
                    
                    {editForm.twoHandedDamage && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-200 mb-2">
                          Two-Handed Damage
                        </label>
                        <TextInput
                          value={editForm.twoHandedDamage}
                          onChange={(value) => updateEditForm('twoHandedDamage', value)}
                          className="w-full"
                        />
                      </div>
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
                      <div>
                        <label className="block text-sm font-medium text-zinc-200 mb-2">
                          Armor Class
                        </label>
                        <TextInput
                          value={editForm.AC.toString()}
                          onChange={(value) => updateEditForm('AC', value)}
                          className="w-full"
                        />
                      </div>
                    )}
                    
                    {editForm.missileAC && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-200 mb-2">
                          Missile AC
                        </label>
                        <TextInput
                          value={editForm.missileAC}
                          onChange={(value) => updateEditForm('missileAC', value)}
                          className="w-full"
                        />
                      </div>
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
                <Button
                  onClick={handleEditSave}
                  variant="primary"
                  size="md"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </CharacterSheetSectionWrapper>
  );
}