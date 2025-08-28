import { Modal } from "@/components/ui/feedback";
import { Switch } from "@/components/ui/inputs";
import { Typography } from "@/components/ui/design-system";
import type { Character } from "@/types/character";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onCharacterChange: (character: Character) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  character,
  onCharacterChange,
}: SettingsModalProps) {
  const handleUseCoinWeightChange = (useCoinWeight: boolean) => {
    const updatedCharacter: Character = {
      ...character,
      settings: {
        ...character.settings,
        useCoinWeight,
      },
    };
    onCharacterChange(updatedCharacter);
  };

  // Default to true if not set
  const useCoinWeight = character.settings?.useCoinWeight !== false;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Character Settings"
      size="md"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Coin Weight Setting */}
          <div className="flex items-start justify-between p-4 border border-zinc-600 rounded-lg bg-zinc-800/50">
            <div className="flex-1 pr-4">
              <Typography
                variant="bodySmall"
                color="zinc"
                weight="medium"
                as="h3"
              >
                Include Coin Weight
              </Typography>
              <p className="text-xs text-zinc-400 mt-1">
                Whether coins contribute to your character's carrying capacity.
                When enabled, 20 coins = 1 pound.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Switch
                label="Toggle coin weight"
                checked={useCoinWeight}
                onCheckedChange={handleUseCoinWeightChange}
                size="md"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
