import { memo } from "react";
import { Card, Typography, Badge } from "@/components/ui/core/display";
import { Icon, Button } from "@/components/ui";
import Details from "@/components/ui/composite/Details";
import type { EquipmentPack } from "@/types";
import { findEquipmentById } from "@/utils/equipment";
import { cn } from "@/utils";

interface EquipmentPackCardProps {
  pack: EquipmentPack;
  isSelected: boolean;
  isRecommended: boolean;
  isAffordable: boolean;
  characterClasses: string;
  onSelect: (pack: EquipmentPack) => void;
  onConfirm?: (pack: EquipmentPack) => void;
  isLoading?: boolean;
}

function EquipmentPackCard({
  pack,
  isSelected,
  isRecommended,
  isAffordable,
  characterClasses,
  onSelect,
  onConfirm,
  isLoading = false,
}: EquipmentPackCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't select the pack if clicking on the confirm button or if not affordable
    if ((e.target as HTMLElement).closest("button")) return;
    if (!isAffordable) return;
    onSelect(pack);
  };

  const cardClassName = cn(
    "transition-all",
    !isAffordable && "opacity-60 cursor-not-allowed",
    isAffordable && "cursor-pointer",
    isSelected && "ring-2 ring-lime-400",
    isAffordable && !isSelected && "hover:ring-1 hover:ring-zinc-400"
  );

  const coinIconClassName = cn(
    isAffordable ? "text-amber-400" : "text-red-400"
  );

  const costTextClassName = cn(
    "text-sm font-medium",
    !isAffordable && "text-red-400"
  );

  return (
    <Card
      variant={isSelected ? "success" : "standard"}
      className={cardClassName}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Typography variant="h6" className="mb-1">
            {pack.name}
          </Typography>
          <div className="flex gap-2 mb-2">
            {isRecommended && (
              <Badge variant="success" size="sm">
                Recommended for {characterClasses}
              </Badge>
            )}
            {!isAffordable && (
              <Badge variant="danger" size="sm">
                Not enough gold
              </Badge>
            )}
          </div>
          <Typography variant="bodySmall" color="secondary" className="mb-2">
            {pack.description}
          </Typography>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Icon name="coin" size="sm" className={coinIconClassName} />
            <span className={costTextClassName}>{pack.cost} gp</span>
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
                {pack.items.map((item, index) => {
                  const equipment = findEquipmentById(item.equipmentId);
                  const equipmentName =
                    equipment?.name || `Unknown (${item.equipmentId})`;

                  return (
                    <div key={index} className="flex justify-between">
                      <span>
                        {item.quantity}× {equipmentName}
                      </span>
                    </div>
                  );
                })}
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
            disabled={isLoading || !isAffordable}
            icon="check"
            iconSize="sm"
          >
            {isAffordable
              ? `Equip This Pack (${pack.cost} gp)`
              : `Cannot Afford (${pack.cost} gp)`}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default memo(EquipmentPackCard);
