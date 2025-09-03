import { useId, cloneElement, isValidElement } from "react";
import type { ReactNode } from "react";
import { Typography } from "@/components/ui/design-system";
import { Icon } from "@/components/ui/display";
import { DESIGN_TOKENS } from "@/constants/designTokens";

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  validation?: ValidationResult;
}

export default function FormField({
  label,
  children,
  error,
  hint,
  required = false,
  className = "",
  labelClassName = "",
  validation,
}: FormFieldProps) {
  const fieldId = useId();
  
  // Use validation error if provided, otherwise use explicit error prop
  const finalError = validation?.error || error;
  
  const errorId = finalError ? `${fieldId}-error` : undefined;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={fieldId}
        className={`block text-sm font-medium ${DESIGN_TOKENS.colors.text.primary} ${labelClassName}`}
      >
        {label}
        {required && (
          <span className="text-red-400 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      <div className="relative">
        {isValidElement(children) 
          ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
              id: fieldId,
              'aria-describedby': [errorId, hintId].filter(Boolean).join(' ') || undefined,
              'aria-required': required || undefined,
              'aria-invalid': finalError ? 'true' : undefined,
            })
          : children
        }
      </div>

      {hint && (
        <Typography 
          variant="caption" 
          color="muted" 
          id={hintId}
          className={DESIGN_TOKENS.colors.text.secondary}
        >
          {hint}
        </Typography>
      )}

      {finalError && (
        <div 
          id={errorId}
          className="flex items-center gap-1 text-sm text-red-400"
          role="alert"
          aria-live="polite"
        >
          <Icon name="exclamation-triangle" size="xs" />
          {finalError}
        </div>
      )}
    </div>
  );
}
