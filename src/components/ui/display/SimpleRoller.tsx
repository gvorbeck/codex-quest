import React, { useState, useId, useEffect } from "react";
import { Button } from "@/components/ui";
import { NumberInput } from "@/components/ui/inputs";
import { roller, logger } from "@/utils";

interface SimpleRollerProps {
  /** The dice formula to roll (e.g., "3d6", "1d20+5") */
  formula: string;
  /** Label for the component, used for accessibility */
  label?: string;
  /** Initial value to display in the input */
  initialValue?: number;
  /** Minimum value for the number input */
  minValue?: number;
  /** Maximum value for the number input */
  maxValue?: number;
  /** Callback when the value changes (either from rolling or manual input) */
  onChange?: (value: number | undefined) => void;
  /** Additional props for the container div */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

const SimpleRoller: React.FC<SimpleRollerProps> = ({
  formula,
  label,
  initialValue,
  minValue,
  maxValue,
  onChange,
  containerProps,
}) => {
  const [value, setValue] = useState<number | undefined>(initialValue);
  const [lastRollResult, setLastRollResult] = useState<string>("");
  const componentId = useId();
  const inputId = `${componentId}-input`;
  const buttonId = `${componentId}-button`;
  const labelId = `${componentId}-label`;
  const resultId = `${componentId}-result`;

  // Sync internal state with initialValue prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleRoll = () => {
    try {
      const result = roller(formula);
      const newValue = result.total;
      setValue(newValue);
      onChange?.(newValue);

      // Create detailed result description for screen readers
      const rollDescription = `Rolled ${formula}: total result is ${newValue}${
        result.rolls ? ` (individual rolls: ${result.rolls.join(", ")})` : ""
      }`;
      setLastRollResult(rollDescription);

      // Announce the result to screen readers
      setTimeout(() => {
        const announcer = document.getElementById("dice-announcer");
        if (announcer) {
          announcer.textContent = rollDescription;
          // Clear after announcement
          setTimeout(() => {
            announcer.textContent = "";
          }, 1000);
        }
      }, 100);
    } catch (error) {
      logger.error("Failed to roll dice:", error);
      setLastRollResult(`Failed to roll ${formula}: ${error}`);
    }
  };

  const handleInputChange = (newValue: number | undefined) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  const effectiveLabel = label || `Roll ${formula}`;
  const buttonText = `Roll ${formula}`;

  return (
    <div role="group" aria-labelledby={labelId} {...containerProps}>
      {/* Screen reader accessible label */}
      <div id={labelId} className="sr-only">
        {effectiveLabel}
      </div>

      {/* Global dice announcer - only create once per page */}
      {!document.getElementById("dice-announcer") && (
        <div
          id="dice-announcer"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      )}

      <div className="flex">
        <NumberInput
          id={inputId}
          value={value || 0}
          onChange={handleInputChange}
          {...(minValue !== undefined && { minValue })}
          {...(maxValue !== undefined && { maxValue })}
          aria-label={`Result of ${formula} roll${
            minValue !== undefined && maxValue !== undefined
              ? ` (range ${minValue}-${maxValue})`
              : ""
          }`}
          aria-describedby={`${buttonId} ${resultId}`}
          className="rounded-r-none border-r-0 shadow-[0_3px_0_0_#3f3f46] focus:shadow-[0_4px_0_0_#b45309] flex-1"
        />
        <Button
          id={buttonId}
          onClick={handleRoll}
          aria-label={`Roll ${formula} dice${
            minValue !== undefined && maxValue !== undefined
              ? `. Expected range: ${minValue} to ${maxValue}`
              : ""
          }`}
          aria-describedby={inputId}
          className="rounded-l-none"
        >
          {buttonText}
        </Button>
      </div>

      {/* Hidden result description for screen readers */}
      {lastRollResult && (
        <div id={resultId} className="sr-only">
          {lastRollResult}
        </div>
      )}
    </div>
  );
};

export default SimpleRoller;
