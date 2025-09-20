import { memo } from "react";
import { Card, Typography, Badge } from "@/components/ui/core/display";
import { Icon, Button } from "@/components/ui";
import Details from "@/components/ui/composite/Details";
import type { EquipmentPack } from "@/types/character";

interface EquipmentPackCardProps {
  pack: EquipmentPack;
  isSelected: boolean;
  isRecommended: boolean;
  characterClasses: string[];
  onSelect: (pack: EquipmentPack) => void;
  onConfirm?: (pack: EquipmentPack) => void;
  isLoading?: boolean;
}

function EquipmentPackCard({
  pack,
  isSelected,
  isRecommended,
  characterClasses,
  onSelect,
  onConfirm,
  isLoading = false
}: EquipmentPackCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't select the pack if clicking on the confirm button
    if ((e.target as HTMLElement).closest('button')) return;
    onSelect(pack);
  };

  return (
    <Card
      variant={isSelected ? "success" : "standard"}
      className={`cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-lime-400" : "hover:ring-1 hover:ring-zinc-400"
      }`}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Typography variant="h6" className="mb-1">
            {pack.name}
          </Typography>
          {isRecommended && (
            <Badge variant="success" size="sm" className="mb-2">
              Recommended for {characterClasses.join(", ")}
            </Badge>
          )}
          <Typography variant="bodySmall" color="secondary" className="mb-2">
            {pack.description}
          </Typography>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Icon name="coin" size="sm" className="text-amber-400" />
            <span className="text-sm font-medium">{pack.cost} gp</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="weight" size="sm" className="text-zinc-400" />
            <span className="text-sm text-zinc-400">{pack.weight} lb</span>
          </div>
        </div>
      </div>

      <Details
        items={[
          {
            label: `View contents (${pack.items.length} items)`,
            children: (
              <div className="space-y-1">
                {pack.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.quantity}× {item.equipmentName}</span>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
        layout="cards"
        size="sm"
      />

      {isSelected && onConfirm && (
        <div className="mt-4 pt-4 border-t border-lime-400/20">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm(pack);
            }}
            className="w-full flex items-center justify-center gap-2"
            loading={isLoading}
            disabled={isLoading}
          >
            <Icon name="check" size="sm" />
            Equip This Pack ({pack.cost} gp)
          </Button>
        </div>
      )}
    </Card>
  );
}

export default memo(EquipmentPackCard);