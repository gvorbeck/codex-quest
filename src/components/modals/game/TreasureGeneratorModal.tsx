import { useState, useCallback, useMemo } from "react";
import { Modal } from "@/components/modals";
import { Button, Select } from "@/components/ui/inputs";
import { Typography, Card } from "@/components/ui/design-system";
import {
  Icon,
  List,
  GridListItem,
  type IconName,
} from "@/components/ui/display";
import { LoadingState, ErrorBoundary } from "@/components/ui/feedback";
import { useNotificationContext } from "@/hooks";
import {
  generateTreasure,
  formatTreasureResult,
  logger,
  getCoinsToDisplay,
  hasCoins,
} from "@/utils";
import {
  TREASURE_TYPES,
  LAIR_TREASURE_TYPES,
  INDIVIDUAL_TREASURE_TYPES,
  UNGUARDED_TREASURE_LEVELS,
} from "@/constants";
import type {
  IndividualTreasureType,
  LairTreasureType,
  TreasureResult,
  TreasureType,
  UnguardedTreasureLevel,
} from "@/types";

interface TreasureGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Constants moved to @/constants/treasureTypes

export default function TreasureGeneratorModal({
  isOpen,
  onClose,
}: TreasureGeneratorModalProps) {
  const [treasureType, setTreasureType] = useState<TreasureType>("lair");
  const [lairType, setLairType] = useState<LairTreasureType>("A");
  const [individualType, setIndividualType] =
    useState<IndividualTreasureType>("P");
  const [unguardedLevel, setUnguardedLevel] =
    useState<UnguardedTreasureLevel>(1);
  const [generatedTreasure, setGeneratedTreasure] =
    useState<TreasureResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showSuccess, showError } = useNotificationContext();

  // Memoize treasure configuration for performance
  const treasureConfig = useMemo(
    () => ({
      type: treasureType,
      subtype:
        treasureType === "lair"
          ? lairType
          : treasureType === "individual"
          ? individualType
          : unguardedLevel,
    }),
    [treasureType, lairType, individualType, unguardedLevel]
  );

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null); // Clear previous errors

    try {
      const treasure = generateTreasure(
        treasureConfig.type,
        treasureConfig.subtype
      );
      setGeneratedTreasure(treasure);

      // Provide success feedback
      showSuccess("Treasure generated successfully!", {
        duration: 3000,
      });
    } catch (error) {
      logger.error("Error generating treasure:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while generating treasure";
      setError(errorMessage);

      showError("Failed to generate treasure. Please try again.", {
        title: "Generation Error",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [treasureConfig, showSuccess, showError]);

  const handleCopy = useCallback(async () => {
    if (!generatedTreasure) return;

    const formattedText = formatTreasureResult(generatedTreasure);

    try {
      await navigator.clipboard.writeText(formattedText);
      showSuccess("Treasure copied to clipboard!", {
        duration: 3000,
      });
    } catch (error) {
      logger.error("Failed to copy treasure:", error);

      try {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = formattedText;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (success) {
          showSuccess("Treasure copied to clipboard!", {
            duration: 3000,
          });
        } else {
          throw new Error("Fallback copy failed");
        }
      } catch {
        showError(
          "Failed to copy treasure to clipboard. Please select and copy manually.",
          {
            title: "Copy Failed",
            duration: 5000,
          }
        );
      }
    }
  }, [generatedTreasure, showSuccess, showError]);

  const handleReset = useCallback(() => {
    setGeneratedTreasure(null);
  }, []);

  const handleClose = useCallback(() => {
    setGeneratedTreasure(null);
    setError(null);
    onClose();
  }, [onClose]);

  // Memoize coins to display for performance
  const coinsToDisplay = useMemo(
    () => (generatedTreasure ? getCoinsToDisplay(generatedTreasure) : []),
    [generatedTreasure]
  );

  const shouldShowCoins = useMemo(
    () => (generatedTreasure ? hasCoins(generatedTreasure) : false),
    [generatedTreasure]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Treasure Generator"
      size="lg"
    >
      <div className="space-y-6">
        {/* Treasure Type Selection */}
        <div className="space-y-4">
          <Typography variant="h3" weight="semibold">
            Select Treasure Type
          </Typography>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            role="radiogroup"
            aria-label="Treasure type selection"
          >
            {TREASURE_TYPES.map((type) => (
              <Button
                key={type.value}
                variant={treasureType === type.value ? "primary" : "secondary"}
                size="md"
                onClick={() => setTreasureType(type.value as TreasureType)}
                className="h-12 flex items-center justify-center gap-2 font-medium transition-all hover:scale-[1.02] focus:scale-[1.02]"
                role="radio"
                aria-checked={treasureType === type.value}
                aria-label={`Select ${type.label}`}
              >
                <Icon
                  name={type.icon as IconName}
                  size="sm"
                  aria-hidden={true}
                />
                <span>{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Subtype Selection */}
        <div className="space-y-3">
          <Typography variant="body" weight="medium" color="primary">
            {treasureType === "lair" && "Select Lair Type"}
            {treasureType === "individual" && "Select Individual Type"}
            {treasureType === "unguarded" && "Select Treasure Level"}
          </Typography>

          {treasureType === "lair" && (
            <Select
              label="Lair Type"
              value={lairType}
              onValueChange={(value) => setLairType(value as LairTreasureType)}
              options={LAIR_TREASURE_TYPES.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
              placeholder="Choose a lair type..."
            />
          )}

          {treasureType === "individual" && (
            <Select
              label="Individual Type"
              value={individualType}
              onValueChange={(value) =>
                setIndividualType(value as IndividualTreasureType)
              }
              options={INDIVIDUAL_TREASURE_TYPES.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
              placeholder="Choose an individual type..."
            />
          )}

          {treasureType === "unguarded" && (
            <Select
              label="Treasure Level"
              value={unguardedLevel.toString()}
              onValueChange={(value) =>
                setUnguardedLevel(parseInt(value) as UnguardedTreasureLevel)
              }
              options={UNGUARDED_TREASURE_LEVELS.map((t) => ({
                value: t.value.toString(),
                label: t.label,
              }))}
              placeholder="Choose a treasure level..."
            />
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Icon
                name="exclamation-triangle"
                size="sm"
                className="text-red-600 dark:text-red-400 flex-shrink-0"
              />
              <Typography
                variant="bodySmall"
                weight="semibold"
                className="text-red-800 dark:text-red-200"
              >
                Error generating treasure
              </Typography>
            </div>
            <Typography
              variant="bodySmall"
              className="text-red-700 dark:text-red-300 mt-1 ml-6"
            >
              {error}
            </Typography>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-14 h-14 p-0"
            aria-label="Generate treasure"
            title="Generate treasure"
            aria-describedby={error ? "generation-error" : undefined}
          >
            <Icon
              name="dice"
              size="md"
              className={isGenerating ? "animate-spin" : ""}
            />
          </Button>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="flex justify-center">
            <LoadingState variant="inline" message="Generating treasure..." />
          </div>
        )}

        {/* Generated Treasure Result */}
        {generatedTreasure && (
          <ErrorBoundary
            fallback={
              <Card className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700">
                <div className="p-4 text-center">
                  <Icon
                    name="exclamation-triangle"
                    size="md"
                    className="text-red-600 dark:text-red-400 mx-auto mb-2"
                  />
                  <Typography
                    variant="h6"
                    color="secondary"
                    weight="semibold"
                    className="mb-2 text-red-800 dark:text-red-200"
                  >
                    Error Displaying Treasure
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    className="text-red-700 dark:text-red-300 mb-3"
                  >
                    There was a problem displaying the generated treasure. The
                    treasure data may be corrupted.
                  </Typography>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReset}
                    className="mr-2"
                  >
                    Try Again
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleGenerate}>
                    Generate New
                  </Button>
                </div>
              </Card>
            }
          >
            <Card className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Typography variant="h3" weight="bold" color="primary">
                    {generatedTreasure.description}
                  </Typography>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      title="Copy treasure to clipboard"
                    >
                      <Icon name="copy" size="sm" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      title="Clear treasure result"
                    >
                      <Icon name="close" size="sm" />
                    </Button>
                  </div>
                </div>

                {/* Coins */}
                {shouldShowCoins && (
                  <div>
                    <Typography
                      variant="body"
                      weight="semibold"
                      className="mb-3"
                    >
                      Coins:
                    </Typography>
                    <div
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-sm"
                      role="list"
                      aria-label="Coin amounts"
                    >
                      {coinsToDisplay.map((coin) => (
                        <div
                          key={coin.key}
                          className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-700"
                          role="listitem"
                        >
                          <Icon
                            name="coin"
                            size="xs"
                            className={`${coin.color} dark:brightness-125`}
                            aria-hidden={true}
                          />
                          <span
                            className="font-medium text-amber-900 dark:text-amber-100"
                            aria-label={`${coin.amount} ${coin.key} pieces`}
                          >
                            {coin.amount} {coin.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gems & Jewelry */}
                {generatedTreasure.gemsAndJewelry.length > 0 && (
                  <div>
                    <Typography
                      variant="body"
                      weight="semibold"
                      className="mb-3"
                    >
                      Gems & Jewelry:
                    </Typography>
                    <div
                      className={`grid gap-2 text-sm ${
                        generatedTreasure.gemsAndJewelry.length > 6
                          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-1"
                      }`}
                    >
                      {generatedTreasure.gemsAndJewelry.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700"
                        >
                          <Icon
                            name="star"
                            size="xs"
                            className="text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-purple-900 dark:text-purple-100 leading-tight">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Magic Items */}
                {generatedTreasure.magicItems.length > 0 && (
                  <div>
                    <Typography
                      variant="body"
                      weight="semibold"
                      className="mb-3"
                    >
                      Magic Items:
                    </Typography>
                    <div
                      className={`grid gap-2 text-sm ${
                        generatedTreasure.magicItems.length > 4
                          ? "grid-cols-1 sm:grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      {generatedTreasure.magicItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700"
                        >
                          <Icon
                            name="lightning"
                            size="xs"
                            className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-blue-900 dark:text-blue-100 leading-tight font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generation Details */}
                {generatedTreasure.breakdown.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 focus:text-zinc-900 dark:focus:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-colors">
                      Generation Details
                    </summary>
                    <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded border border-zinc-200 dark:border-zinc-700">
                      <List variant="grid" spacing="tight" size="sm">
                        {generatedTreasure.breakdown.map((detail, index) => (
                          <GridListItem key={index}>{detail}</GridListItem>
                        ))}
                      </List>
                    </div>
                  </details>
                )}
              </div>
            </Card>
          </ErrorBoundary>
        )}
      </div>
    </Modal>
  );
}
