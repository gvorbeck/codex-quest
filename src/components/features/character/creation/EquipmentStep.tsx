import { useMemo, memo, useEffect, useState } from "react";
import {
  StepWrapper,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/components/ui/core/layout";
import { SimpleRoller } from "@/components/domain/dice";
import { Button, Icon } from "@/components/ui";
import { Card, Typography, Badge } from "@/components/ui/core/display";
import { InfoCardHeader, StatGrid } from "@/components/ui/composite";
import { ErrorDisplay } from "@/components/ui/core/feedback";
import type { BaseStepProps } from "@/types";
import type { EquipmentPack } from "@/types";
import { EquipmentSelector } from "@/components/domain/equipment";
import { useEquipmentManagement } from "@/hooks";
import { useCharacterMutations } from "@/hooks/mutations/useEnhancedMutations";
import { formatCurrency } from "@/utils/currency";
import { getCharacterSpellSystemType } from "@/utils/character";
import EquipmentPackSelector from "./EquipmentPackSelector";

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

  // Equipment pack state
  const [showPackSelector, setShowPackSelector] = useState(true);
  const [selectedPack, setSelectedPack] = useState<EquipmentPack | null>(null);

  // Equipment pack mutations
  const { applyEquipmentPack, isApplyingPack, packError } =
    useCharacterMutations({
      onPackApplied: () => {
        setShowPackSelector(false);
      },
    });

  // Handle pack selection
  const handlePackSelected = async (pack: EquipmentPack) => {
    try {
      const { character: updatedCharacter } = await applyEquipmentPack({
        character,
        pack,
      });
      onCharacterChange(updatedCharacter);
      setSelectedPack(pack);
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const handleRemovePack = () => {
    setSelectedPack(null);
    setShowPackSelector(true);
    // Note: We don't remove the equipment here - user can remove items individually if needed
  };

  // Auto-add spellbook for magic-users
  const spellSystemType = useMemo(
    () => getCharacterSpellSystemType(character),
    [character]
  );

  const isMagicUser = spellSystemType === "magic-user";

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
                  Current: {formatCurrency(character.currency)}
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
              {cleanedEquipment.map((item) => {
                const itemKey = `${item.name}-${item.category || "no-cat"}-${
                  item.subCategory || "no-sub"
                }-${item.costValue || 0}-${item.weight || 0}`;
                return (
                  <Card key={itemKey} variant="success">
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
                );
              })}
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

      {/* Equipment Selection Tabs */}
      <section className="mb-8">
        <Typography variant="sectionHeading" className="mb-6">
          Equipment Selection
        </Typography>

        <Tabs defaultValue="equipment-packs" variant="underline" size="md">
          <TabList aria-label="Equipment selection methods">
            <Tab value="equipment-packs">Equipment Packs</Tab>
            <Tab value="individual-items">Individual Items</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="equipment-packs">
              {/* Equipment Pack Error */}
              <ErrorDisplay error={packError?.message} className="mb-6" />

              {/* Equipment Pack Selector */}
              {showPackSelector && (
                <EquipmentPackSelector
                  character={character}
                  onPackSelected={handlePackSelected}
                  isLoading={isApplyingPack}
                />
              )}

              {/* Selected Pack Summary */}
              {selectedPack && !showPackSelector && (
                <div className="mb-8">
                  <Card variant="success" className="mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            name="check"
                            size="sm"
                            className="text-lime-400"
                          />
                          <Typography variant="h6" className="m-0">
                            {selectedPack.name}
                          </Typography>
                        </div>
                        <Typography
                          variant="bodySmall"
                          color="secondary"
                          className="mb-3"
                        >
                          {selectedPack.description}
                        </Typography>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Icon
                              name="coin"
                              size="sm"
                              className="text-amber-400"
                            />
                            <span className="text-sm font-medium">
                              {selectedPack.cost} gp spent
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon
                              name="weight"
                              size="sm"
                              className="text-zinc-400"
                            />
                            <span className="text-sm text-zinc-400">
                              {selectedPack.weight} lb added
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePack}
                        className="flex items-center gap-1"
                        icon="plus"
                        iconSize="sm"
                      >
                        Add Another Pack
                      </Button>
                    </div>
                  </Card>

                  <Typography variant="bodySmall" color="secondary">
                    You can still add or remove individual equipment items in
                    the "Individual Items" tab.
                  </Typography>
                </div>
              )}
            </TabPanel>

            <TabPanel value="individual-items">
              <EquipmentSelector
                character={character}
                onEquipmentAdd={handleEquipmentAdd}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>
    </StepWrapper>
  );
}

export default memo(EquipmentStep);
