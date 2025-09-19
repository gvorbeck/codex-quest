import { useMemo, memo, useEffect } from "react";
import { StepWrapper } from "@/components/ui/core/layout";
import { SimpleRoller } from "@/components/domain/dice";
import { Button, Icon } from "@/components/ui";
import { Card, Typography, Badge } from "@/components/ui/core/display";
import { InfoCardHeader, StatGrid } from "@/components/ui/composite";
import type { BaseStepProps } from "@/types";
import { EquipmentSelector } from "@/components/domain/equipment";
import { useEquipmentManagement } from "@/hooks";

type EquipmentStepProps = BaseStepProps;

function EquipmentStep({ character, onCharacterChange }: EquipmentStepProps) {
  const {
    startingGold,
    handleGoldRoll,
    handleEquipmentAdd,
    handleEquipmentRemove,
    totalWeight,
    totalValue,
    cleanedEquipment,
    getStatusMessage,
  } = useEquipmentManagement(character, onCharacterChange);

  // Auto-add spellbook for magic-users
  const isMagicUser = useMemo(
    () => character.class.includes("magic-user"),
    [character.class]
  );

  const hasSpellbook = useMemo(
    () =>
      character.equipment.some((item) => item.name === "Spellbook (128 pages)"),
    [character.equipment]
  );

  // Initialize character with spellbook if they're a magic-user and don't have one
  useEffect(() => {
    if (isMagicUser && !hasSpellbook) {
      const spellbook = {
        name: "Spellbook (128 pages)",
        costValue: 25,
        costCurrency: "gp" as const,
        weight: 1,
        category: "general-equipment" as const,
        subCategory: "wizards-wares" as const,
        amount: 1,
      };

      onCharacterChange({
        ...character,
        equipment: [...character.equipment, spellbook],
      });
    }
  }, [isMagicUser, hasSpellbook, character, onCharacterChange]);

  return (
    <StepWrapper
      title="Equipment"
      description="Roll for starting gold and select your character's equipment."
      statusMessage={getStatusMessage()}
    >
      {/* Starting Gold Section */}
      <section className="mb-8">
        <Typography variant="sectionHeading">Starting Gold</Typography>

        <Card variant="info" className="mb-6">
          <InfoCardHeader
            icon={<Icon name="coin" size="md" aria-hidden={true} />}
            title="Gold Information"
            className="mb-4"
          />
          <Typography variant="description" color="primary">
            Roll 3d6 × 10 for your character's starting gold pieces. Use this
            gold to purchase equipment and supplies.
          </Typography>
        </Card>

        <Card variant="standard">
          <SimpleRoller
            formula="3d6*10"
            label="Starting Gold (3d6 × 10)"
            {...(startingGold !== undefined && {
              initialValue: startingGold,
            })}
            onChange={handleGoldRoll}
          />

          {startingGold !== undefined && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-8">
              <div className="flex items-center gap-2">
                <Icon
                  name="coin"
                  size="sm"
                  className="text-lime-400"
                  aria-hidden={true}
                />
                <span className="font-medium text-zinc-100">
                  Current: {character.currency.gold} gp
                </span>
              </div>
              {startingGold !== character.currency.gold && (
                <div className="flex items-center gap-2">
                  <Icon name="clock" size="sm" className="text-zinc-400" />
                  <span className="font-medium text-zinc-400">
                    Started: {startingGold} gp
                  </span>
                </div>
              )}
            </div>
          )}
        </Card>
      </section>

      {/* Current Equipment Section */}
      <section className="mb-8">
        <Typography variant="sectionHeading">Current Equipment</Typography>

        {cleanedEquipment.length === 0 ? (
          <Card variant="standard">
            <div className="flex items-center gap-3">
              <Icon name="clipboard" size="md" className="text-zinc-400" />
              <Typography variant="body" color="muted" className="italic">
                No equipment selected yet. Browse available equipment below.
              </Typography>
            </div>
          </Card>
        ) : (
          <Card variant="success" className="p-0">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="clipboard" size="md" className="text-lime-400" />
              <Typography
                variant="h5"
                color="zinc"
                weight="semibold"
                className="m-0"
              >
                Equipment Inventory
              </Typography>
            </div>

            <div className="space-y-3 mb-6">
              {cleanedEquipment.map((item, index) => (
                <Card key={`${item.name}-${item.category}-${item.subCategory}-${index}`} variant="success">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-lime-100">
                          {item.name}
                        </span>
                        {item.amount > 1 && (
                          <Badge variant="status">× {item.amount}</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-lime-200">
                        {item.weight > 0 && (
                          <span>
                            {Math.round(item.weight * item.amount * 10) / 10}{" "}
                            lbs
                          </span>
                        )}
                        {item.costValue > 0 && (
                          <span>
                            {item.costValue * item.amount} {item.costCurrency}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleEquipmentRemove(item.name)}
                      className="self-start sm:self-center"
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Equipment Summary */}
            <StatGrid
              stats={[
                {
                  label: "Total Weight",
                  value: `${totalWeight} lbs`,
                  icon: <Icon name="weight" size="sm" aria-hidden={true} />,
                },
                {
                  label: "Total Value",
                  value: `${totalValue} gp`,
                  icon: <Icon name="coin" size="sm" aria-hidden={true} />,
                },
              ]}
              variant="equipment"
              columns={{ base: 1, sm: 2 }}
            />
          </Card>
        )}
      </section>

      {/* Available Equipment Section */}
      <EquipmentSelector
        character={character}
        onEquipmentAdd={handleEquipmentAdd}
      />
    </StepWrapper>
  );
}

export default memo(EquipmentStep);
