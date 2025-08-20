import React, { useRef, useState, useId } from "react";
import { Button } from "@/components/ui";

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
    [ariaDescribedBy, errorId, helperTextId].filter(Boolean).join(" ") ||
    undefined;

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
      console.error("File validation error:", validationError);
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Allow Enter and Space to trigger file selection
    if ((event.key === "Enter" || event.key === " ") && !disabled) {
      event.preventDefault();
      handleButtonClick();
    }
  };

  return (
    <div>
      <label
        htmlFor={inputId}
      >
        {label}
        {required && (
          <span aria-label="required">
            {" "}
            *
          </span>
        )}
      </label>

      {helperText && (
        <div
          id={helperTextId}
        >
          {helperText}
        </div>
      )}

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
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleButtonClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label={
          selectedFileName
            ? `Selected file: ${selectedFileName}. Click to change.`
            : `Click to select a file or drag and drop`
        }
        aria-describedby={describedByIds}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {selectedFileName ? (
          <div>
            <div>
              ✓ {selectedFileName}
            </div>
            <div>
              Click to change or drag a new file here
            </div>
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              Remove File
            </Button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📁</div>
            <div style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              {dragOver ? "Drop your file here" : "Click to select a file"}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6c757d" }}>
              or drag and drop a file here
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
