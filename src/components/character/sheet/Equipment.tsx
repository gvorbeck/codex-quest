import { useState, useCallback } from "react";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { Card, Badge, Typography } from "@/components/ui/design-system";
import { Button, Switch } from "@/components/ui/inputs";
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
    [editable, toggleWearing, handleEquipmentRemove, formatCost, formatWeight]
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
      </div>
    </CharacterSheetSectionWrapper>
  );
}