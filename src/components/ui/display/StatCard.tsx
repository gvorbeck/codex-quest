import { forwardRef, useState } from "react";
import { EditIcon } from "@/components/ui/display";
import { EditableValue } from "@/components/ui/inputs";
import { DESIGN_TOKENS, SIZE_STYLES } from "@/constants/designTokens";

interface StatCardProps {
  /** The main label/title for the stat */
  label: string;
  /** Full name for accessibility and tooltips */
  fullName?: string;
  /** The primary value to display */
  value: string | number;
  /** Optional secondary value (like modifier) */
  secondaryValue?: string | number;
  /** Custom color class for the value */
  valueColor?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether the card is clickable/editable */
  editable?: boolean;
  /** Change handler for editable values */
  onChange?: (value: number) => void;
  /** Min value for editing */
  minValue?: number;
  /** Max value for editing */
  maxValue?: number;
  /** Click handler */
  onClick?: () => void;
  /** Keyboard event handler */
  onKeyDown?: (e: React.KeyboardEvent) => void;
  /** Additional CSS classes */
  className?: string;
  /** Custom content to replace the default value display */
  children?: React.ReactNode;
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({
    label,
    fullName,
    value,
    secondaryValue,
    valueColor = DESIGN_TOKENS.colors.text.primary,
    size = "md",
    editable = false,
    onChange,
    minValue = 3,
    maxValue = 25,
    onClick,
    onKeyDown,
    className = "",
    children,
  }, ref) => {
    const currentSize = SIZE_STYLES[size];
    const [isEditing, setIsEditing] = useState(false);

    const handleClick = () => {
      if (editable) {
        if (onChange) {
          setIsEditing(true);
        } else if (onClick) {
          onClick();
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (editable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        if (onChange) {
          setIsEditing(true);
        } else {
          onClick?.();
        }
      }
      onKeyDown?.(e);
    };

    const handleValueChange = (newValue: number) => {
      onChange?.(newValue);
      setIsEditing(false);
    };

    return (
      <div
        ref={ref}
        className={`
          ${DESIGN_TOKENS.colors.bg.ability}
          ${DESIGN_TOKENS.effects.roundedSm}
          border-2 ${DESIGN_TOKENS.colors.border.ability}
          ${DESIGN_TOKENS.effects.abilityShadow}
          ${currentSize.abilityContainer}
          ${DESIGN_TOKENS.effects.transition}
          hover:${DESIGN_TOKENS.colors.bg.abilityHover}
          hover:border-amber-400/40
          hover:scale-105
          group/stat-card
          text-center
          relative
          overflow-hidden
          ${editable ? "cursor-pointer" : ""}
          ${className}
        `}
        title={fullName || label}
        onClick={handleClick}
        role={editable ? "button" : undefined}
        tabIndex={editable ? 0 : undefined}
        aria-label={editable && fullName ? `Edit ${fullName} (current: ${value})` : undefined}
        onKeyDown={handleKeyDown}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Label */}
          <h3
            className={`
              ${DESIGN_TOKENS.colors.text.accent} 
              ${currentSize.abilityName}
              group-hover/stat-card:text-amber-300
              transition-colors duration-200
            `}
          >
            {label}
          </h3>

          {/* Custom content or default value display */}
          {children || (
            <>
              {/* Primary Value - with editing support */}
              {isEditing && onChange ? (
                <div className="mb-1">
                  <EditableValue
                    value={typeof value === 'number' ? value : parseInt(String(value))}
                    onChange={handleValueChange}
                    minValue={minValue}
                    maxValue={maxValue}
                    editable={true}
                    displayClassName={`${valueColor} ${currentSize.abilityScore} leading-none relative`}
                    inputClassName="text-center bg-zinc-700 border-amber-400 text-zinc-100"
                    size={size}
                    ariaLabel={`${fullName || label} value`}
                  />
                </div>
              ) : (
                <div
                  className={`
                    ${valueColor}
                    ${currentSize.abilityScore}
                    leading-none
                    mb-1
                    transition-colors duration-200
                    relative
                  `}
                >
                  {value}
                  {editable && (
                    <EditIcon
                      className={`
                        w-3 h-3 text-zinc-400 
                        opacity-0 group-hover/stat-card:opacity-100 
                        transition-opacity duration-200
                        absolute -top-1 right-2
                      `}
                    />
                  )}
                </div>
              )}

              {/* Secondary Value (like modifier) */}
              {secondaryValue !== undefined && (
                <div
                  className={`
                    ${DESIGN_TOKENS.colors.text.modifier}
                    ${currentSize.abilityModifier}
                    font-mono
                    bg-zinc-900/50
                    px-2 py-1
                    ${DESIGN_TOKENS.effects.roundedSm}
                    border border-lime-500/20
                    inline-block
                    min-w-[3rem]
                  `}
                >
                  {secondaryValue}
                </div>
              )}
            </>
          )}
        </div>

        {/* Hover indicator */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400/0 via-amber-400/60 to-amber-400/0 transform translate-y-full group-hover/stat-card:translate-y-0 transition-transform duration-200"></div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export default StatCard;