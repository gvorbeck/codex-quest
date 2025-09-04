import React, { useRef, useState, useId } from "react";
import { Button } from "@/components/ui";
import { Icon } from "@/components/ui/display";
import { logger } from "@/utils/logger";
import { cn } from "@/constants/styles";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeBytes?: number;
  label: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "image/*",
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  label,
  helperText,
  error,
  disabled = false,
  required = false,
  "aria-describedby": ariaDescribedBy,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const generatedId = useId();
  const inputId = `file-upload-${generatedId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperTextId = helperText ? `${inputId}-helper` : undefined;

  // Combine all describedby IDs
  const describedByIds =
    cn(ariaDescribedBy, errorId, helperTextId) || undefined;

  const validateFile = (file: File): string | null => {
    if (maxSizeBytes && file.size > maxSizeBytes) {
      return `File size must be less than ${Math.round(
        maxSizeBytes / (1024 * 1024)
      )}MB`;
    }

    // Check if file type is allowed
    if (accept && accept !== "*/*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const isValidType = acceptedTypes.some((acceptedType) => {
        if (acceptedType.endsWith("/*")) {
          const category = acceptedType.slice(0, -2);
          return file.type.startsWith(category);
        }
        return (
          file.type === acceptedType ||
          file.name.toLowerCase().endsWith(acceptedType.replace(".", ""))
        );
      });

      if (!isValidType) {
        return `File type not supported. Accepted types: ${accept}`;
      }
    }

    return null;
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFileName("");
      onFileSelect(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      // Could trigger an error callback here if needed
      logger.error("File validation error:", validationError);
      return;
    }

    setSelectedFileName(file.name);
    onFileSelect(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handleFileSelect(null);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    if (disabled) return;

    const files = Array.from(event.dataTransfer.files);
    const file = files[0] || null;
    handleFileSelect(file);
  };

  const dropZoneClasses = cn(
    "border-2 border-dashed rounded-lg p-6 text-center transition-colors mt-2",
    dragOver
      ? "border-amber-400 bg-amber-400/10"
      : "border-zinc-600 hover:border-zinc-500",
    disabled && "opacity-60 cursor-not-allowed"
  );

  return (
    <div>
      <label htmlFor={inputId}>
        {label}
        {required && <span aria-label="required"> *</span>}
      </label>

      {helperText && <div id={helperTextId}>{helperText}</div>}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id={inputId}
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        required={required}
        aria-describedby={describedByIds}
        aria-invalid={error ? true : undefined}
        className="sr-only"
      />

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={dropZoneClasses}
      >
        {selectedFileName ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-lime-400">
              <Icon name="check" size="sm" />
              <span className="font-medium">{selectedFileName}</span>
            </div>
            <div className="text-zinc-400 text-sm">
              Click to change or drag a new file here
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleButtonClick}
                disabled={disabled}
                aria-label={`Change selected file: ${selectedFileName}`}
                aria-describedby={describedByIds}
              >
                Change File
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                disabled={disabled}
              >
                Remove File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-zinc-400">
              <Icon name="photo" size="xl" className="mx-auto mb-4" />
            </div>
            <div className="space-y-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleButtonClick}
                disabled={disabled}
                aria-label="Click to select a file or drag and drop"
                aria-describedby={describedByIds}
              >
                <Icon name="upload" size="sm" />
                {dragOver ? "Drop your file here" : "Click to select a file"}
              </Button>
              <div className="text-zinc-500 text-sm">
                or drag and drop a file here
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="assertive"
          style={{
            color: "#dc3545",
            fontSize: "0.875rem",
            marginTop: "0.25rem",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
