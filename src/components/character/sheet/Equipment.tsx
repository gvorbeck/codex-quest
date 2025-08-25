import { useState, useCallback } from "react";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { Card, Badge, Typography } from "@/components/ui/design-system";
import { Button, Switch } from "@/components/ui/inputs";
import { Accordion } from "@/components/ui/layout";
import { EquipmentSelector } from "@/components/character/management";
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
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {formatCost(item.costValue, item.costCurrency, item.amount)}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M4 7h1v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7h1c.55 0 1-.45 1-1s-.45-1-1-1h-3c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2H4c-.55 0-1 .45-1 1s.45 1 1 1z"/>
                  <circle cx="8" cy="10" r="1.5"/>
                  <circle cx="16" cy="10" r="1.5"/>
                  <rect x="7" y="11" width="10" height="2" rx="1"/>
                </svg>
                {formatWeight(item.weight, item.amount)}
              </span>
              {item.damage && (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  {item.damage}
                  {item.twoHandedDamage && ` / ${item.twoHandedDamage}`}
                </span>
              )}
              {item.AC && (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 1L3 5v6c0 8 9 12 9 12s9-4 9-12V5l-9-4z"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none"/>
                  </svg>
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