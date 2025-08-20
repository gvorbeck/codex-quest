import React, { useState, useId, useEffect } from "react";
import Button from "./Button";
import NumberInput from "./NumberInput";
import { roller } from "../../utils/dice";

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
  const componentId = useId();
  const inputId = `${componentId}-input`;
  const buttonId = `${componentId}-button`;
  const labelId = `${componentId}-label`;

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
    } catch (error) {
      console.error("Failed to roll dice:", error);
      // Could add error handling UI here if needed
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
      <div
        id={labelId}
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: "0",
        }}
      >
        {effectiveLabel}
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <NumberInput
          id={inputId}
          value={value || 0}
          onChange={handleInputChange}
          {...(minValue !== undefined && { minValue })}
          {...(maxValue !== undefined && { maxValue })}
          aria-label={`Result of ${formula} roll`}
          aria-describedby={buttonId}
        />
        <Button
          id={buttonId}
          onClick={handleRoll}
          aria-label={`Roll ${formula} dice`}
          aria-describedby={inputId}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default SimpleRoller;
