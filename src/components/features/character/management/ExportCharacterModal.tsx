import { useState } from "react";
import Modal from "@/components/modals/base/Modal";
import { Button, Select } from "@/components/ui";
import { Callout } from "@/components/ui/core/feedback";
import { useNotificationContext } from "@/hooks";
import { getCharacterById } from "@/services";
import {
  generateCharacterSheetText,
  sanitizeFilename,
  formatDate,
} from "@/utils/characterExport";
import { downloadFile } from "@/utils/fileDownload";
import type { CharacterListItem } from "@/services";
import { logger } from "@/utils";
import { cn } from "@/utils";

interface ExportCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterListItem[];
  userId: string;
}

type ExportFormat = "json" | "txt";

const formatOptions = [
  { value: "json", label: "JSON (Machine-readable)" },
  { value: "txt", label: "TXT (Character Sheet)" },
];

export default function ExportCharacterModal({
  isOpen,
  onClose,
  characters,
  userId,
}: ExportCharacterModalProps) {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("json");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notifications = useNotificationContext();

  const handleExport = async () => {
    if (!selectedCharacterId) {
      setError("Please select a character to export");
      return;
    }

    setExporting(true);
    setError(null);

    try {
      // 1. Fetch full character data
      const fullCharacter = await getCharacterById(userId, selectedCharacterId);

      if (!fullCharacter) {
        throw new Error("Character not found. Please refresh the page and try again.");
      }

      // 2. Generate export content and trigger download
      const baseFilename = `${sanitizeFilename(fullCharacter.name)}_${formatDate()}`;

      if (exportFormat === "json") {
        const content = JSON.stringify(fullCharacter, null, 2);
        downloadFile(content, `${baseFilename}.json`, "application/json");
      } else {
        const content = generateCharacterSheetText(fullCharacter);
        downloadFile(content, `${baseFilename}.txt`, "text/plain");
      }

      // 3. Success
      notifications.showSuccess(
        `Exported ${fullCharacter.name} as ${exportFormat.toUpperCase()}`
      );
      onClose();
      setSelectedCharacterId(null);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while exporting the character";
      setError(errorMessage);
      logger.error("Export error:", error);
      notifications.showError(`Export failed: ${errorMessage}`);
    } finally {
      setExporting(false);
    }
  };

  const handleClose = () => {
    if (exporting) return; // Prevent closing while exporting
    setSelectedCharacterId(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Export Character" size="md">
      <div className="space-y-6">
        {/* Character Selection */}
        <div>
          <label className="block font-medium text-zinc-100 mb-3">
            Select Character
          </label>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedCharacterId(char.id)}
                disabled={exporting}
                className={cn(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  selectedCharacterId === char.id
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600",
                  exporting && "opacity-60 cursor-not-allowed"
                )}
                aria-pressed={selectedCharacterId === char.id}
              >
                <div className="font-semibold text-zinc-100">{char.name}</div>
                <div className="text-sm text-zinc-400">
                  Level {char.level} {char.class} • {char.race}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <Select
          label="Export Format"
          options={formatOptions}
          value={exportFormat}
          onValueChange={(value) => setExportFormat(value as ExportFormat)}
          size="md"
          disabled={exporting}
        />

        {/* Error Display */}
        {error && (
          <Callout variant="error" className="mt-4">
            {error}
          </Callout>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={exporting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleExport}
            disabled={!selectedCharacterId || exporting}
            loading={exporting}
            loadingText="Exporting..."
            icon="clipboard"
            iconSize="sm"
          >
            Export Character
          </Button>
        </div>
      </div>
    </Modal>
  );
}
