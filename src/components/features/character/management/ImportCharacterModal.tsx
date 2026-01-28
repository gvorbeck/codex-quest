import { useState } from "react";
import Modal from "@/components/modals/base/Modal";
import { FileUpload, Button, Accordion } from "@/components/ui";
import { Callout } from "@/components/ui/core/feedback";
import { useCharacterMutations } from "@/hooks/mutations/useEnhancedMutations";
import { useNotificationContext } from "@/hooks";
import { processCharacterData } from "@/services/characterMigration";
import {
  isValidCharacterStructure,
  validateImportedCharacter,
} from "@/validation/character";
import type { Character } from "@/types";
import { logger } from "@/utils";

interface ImportCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const EXAMPLE_CHARACTER = `{
  "name": "Thorin Oakenshield",
  "race": "dwarf",
  "class": "fighter",
  "level": 1,
  "xp": 0,
  "abilities": {
    "strength": { "value": 16, "modifier": 2 },
    "dexterity": { "value": 12, "modifier": 0 },
    "constitution": { "value": 15, "modifier": 1 },
    "intelligence": { "value": 10, "modifier": 0 },
    "wisdom": { "value": 13, "modifier": 1 },
    "charisma": { "value": 14, "modifier": 1 }
  },
  "hp": { "current": 8, "max": 8, "die": "1d8" },
  "currency": { "gold": 100 },
  "equipment": [],
  "settings": { "version": 2.6 }
}`;

export default function ImportCharacterModal({
  isOpen,
  onClose,
  userId,
}: ImportCharacterModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const { saveCharacter } = useCharacterMutations();
  const notifications = useNotificationContext();

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setError(null); // Clear any previous errors
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError("Please select a file to import");
      return;
    }

    setImporting(true);
    setError(null);

    try {
      // 1. Read and parse the file
      const text = await selectedFile.text();
      let rawData: unknown;

      try {
        rawData = JSON.parse(text);
      } catch {
        throw new Error("Invalid file format. Please upload a valid JSON file.");
      }

      // 2. Validate basic structure
      if (!isValidCharacterStructure(rawData)) {
        throw new Error(
          "Character file is missing required data. Please ensure the file contains all required fields (name, abilities, race, class, hp, level)."
        );
      }

      // 3. Migrate and process data
      let migratedCharacter: Character;
      try {
        migratedCharacter = processCharacterData(rawData);
      } catch (migrationError) {
        logger.error("Migration error:", migrationError);
        throw new Error(
          "Unable to process character data. The file may be corrupted or use an incompatible format."
        );
      }

      // 4. Validate character data
      const validationResult = validateImportedCharacter(migratedCharacter);
      if (!validationResult.isValid) {
        throw new Error(
          `Character data validation failed: ${validationResult.errors.join(", ")}`
        );
      }

      // 5. Save character (without ID to create new)
      saveCharacter(
        {
          userId,
          character: migratedCharacter,
          // No characterId = create new character
        },
        {
          onSuccess: () => {
            notifications.showSuccess(
              `Successfully imported ${migratedCharacter.name}`
            );
            onClose();
            setSelectedFile(null);
            setError(null);
          },
          onError: (error) => {
            logger.error("Save error:", error);
            setError("Failed to save character. Please try again.");
          },
        }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      logger.error("Import error:", error);
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    if (importing) return; // Prevent closing while importing
    setSelectedFile(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Character" size="lg">
      <div className="space-y-6">
        {/* File Upload */}
        <FileUpload
          label="Select Character File"
          helperText="Upload a JSON file containing character data (max 1MB)"
          accept=".json,application/json"
          maxSizeBytes={1024 * 1024} // 1MB
          onFileSelect={handleFileSelect}
          disabled={importing}
        />

        {/* Error Display */}
        {error && (
          <Callout variant="error" className="mt-4">
            {error}
          </Callout>
        )}

        {/* Example JSON Structure */}
        <Accordion
          items={[
            {
              id: "example",
              name: "Example Character Format",
              content: EXAMPLE_CHARACTER,
            },
          ]}
          sortBy="id"
          labelProperty="name"
          renderItem={(item) => (
            <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto text-xs">
              <code className="text-zinc-300">{String(item.content)}</code>
            </pre>
          )}
          showCounts={false}
          showSearch={false}
          className="mt-4"
        />

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={importing}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleImport}
            disabled={!selectedFile || importing}
            loading={importing}
            loadingText="Importing..."
            icon="upload"
            iconSize="sm"
          >
            Import Character
          </Button>
        </div>
      </div>
    </Modal>
  );
}
