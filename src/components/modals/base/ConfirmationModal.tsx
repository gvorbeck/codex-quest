import { useState } from "react";
import Modal from "./Modal";
import { Button, Typography, TextInput, Callout } from "@/components/ui";
import { Icon } from "@/components/ui/core/display";
import { getEntityDeletionDescription } from "@/utils";

type EntityType = "character" | "game" | "player";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  entityName: string;
  confirmText: string;
  variant: "error" | "warning";
  description: string;
  flavorText: string;
  loadingText: string;
  actionLabel: string;
  isProcessing?: boolean;
}

interface DeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityType: EntityType;
  entityName: string;
  isDeleting?: boolean;
}

const ENTITY_CONFIGS: Record<
  EntityType,
  {
    title: string;
    confirmText: string;
    variant: "error" | "warning";
    description: string;
    flavorText: string;
    loadingText: string;
    actionLabel: string;
  }
> = {
  character: {
    title: "Permanent Deletion",
    confirmText: "DELETE",
    variant: "error",
    description: "You're about to destroy this character forever",
    flavorText:
      "When an adventurer's tale ends, the echoes of their deeds fade from tavern songs, their name forgotten by the very realms they once protected...",
    loadingText: "Banishing to the Void...",
    actionLabel: "Delete",
  },
  game: {
    title: "Permanent Deletion",
    confirmText: "DELETE",
    variant: "error",
    description: "You're about to destroy this game forever",
    flavorText:
      "When a campaign ends, the stories fade from memory, the bonds between adventurers scatter to the winds, and the tales of heroism become whispers in the darkness...",
    loadingText: "Banishing to the Void...",
    actionLabel: "Delete",
  },
  player: {
    title: "Remove Player from Game",
    confirmText: "REMOVE",
    variant: "warning",
    description: "You're about to remove this player from the game",
    flavorText:
      "Sometimes adventurers must part ways, taking different paths on their journey. The bonds forged remain, even when the party disbands...",
    loadingText: "Removing Player...",
    actionLabel: "Remove Player",
  },
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  entityName,
  confirmText,
  variant,
  description,
  flavorText,
  loadingText,
  actionLabel,
  isProcessing = false,
}: ConfirmationModalProps) {
  const [inputText, setInputText] = useState("");
  const isConfirmValid = inputText.trim().toUpperCase() === confirmText;

  const handleConfirm = () => {
    if (isConfirmValid && !isProcessing) {
      onConfirm();
      setInputText("");
    }
  };

  const handleClose = () => {
    setInputText("");
    onClose();
  };

  const iconName = variant === "error" ? "trash" : "minus";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <div className="space-y-6">
        {/* Warning Section */}
        <Callout variant={variant} title={description} size="lg">
          <Typography variant="body" className="leading-relaxed">
            <strong className="text-accent-foreground">"{entityName}"</strong>{" "}
            {getEntityDeletionDescription(variant, entityName, title)}
          </Typography>
        </Callout>

        {/* Atmospheric flavor text */}
        <Callout variant="neutral" size="sm">
          <Typography
            variant="helper"
            className="text-muted-foreground italic text-center leading-relaxed"
          >
            "{flavorText}"
          </Typography>
        </Callout>

        {/* Confirmation Input */}
        <div className="space-y-4">
          <Typography
            variant="body"
            className="text-foreground"
            id="confirm-description"
          >
            To confirm this {variant === "error" ? "irreversible" : ""} action,
            type{" "}
            <Typography
              variant="code"
              color={variant === "error" ? "red" : "amber"}
              as="code"
            >
              {confirmText}
            </Typography>{" "}
            in the field below:
          </Typography>

          <div className="relative">
            <TextInput
              value={inputText}
              onChange={setInputText}
              placeholder={`Type "${confirmText}" to confirm`}
              disabled={isProcessing}
              error={inputText.length > 0 && !isConfirmValid}
              className="font-mono"
              aria-label={`Type ${confirmText} to confirm ${actionLabel.toLowerCase()}`}
              aria-describedby="confirm-description validation-message"
              showClearButton={false}
            />

            {/* Screen reader feedback */}
            <div id="validation-message" className="sr-only" aria-live="polite">
              {inputText &&
                (isConfirmValid
                  ? "Confirmation text is correct"
                  : "Confirmation text is incorrect")}
            </div>

            {/* Visual validation indicator */}
            {inputText && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon
                  name={isConfirmValid ? "check-circle" : "x-circle"}
                  size="sm"
                  className={isConfirmValid ? "text-success" : "text-warning"}
                  aria-hidden={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant={variant === "error" ? "destructive" : "secondary"}
            onClick={handleConfirm}
            disabled={!isConfirmValid || isProcessing}
            loading={isProcessing}
            loadingText={loadingText}
            className="flex-1"
            aria-describedby={
              !isConfirmValid ? "confirm-description" : undefined
            }
            icon={iconName}
            iconSize="sm"
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function DeletionModal({
  isOpen,
  onClose,
  onConfirm,
  entityType,
  entityName,
  isDeleting = false,
}: DeletionModalProps) {
  const config = ENTITY_CONFIGS[entityType];

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={config.title}
      entityName={entityName}
      confirmText={config.confirmText}
      variant={config.variant}
      description={config.description}
      flavorText={config.flavorText}
      loadingText={config.loadingText}
      actionLabel={config.actionLabel}
      isProcessing={isDeleting}
    />
  );
}
