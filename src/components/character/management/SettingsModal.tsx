import { Modal } from "@/components/ui/feedback";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Character Settings"
      size="md"
    >
      <div className="space-y-6">
        <p className="text-zinc-300">
          Character settings will be available here in a future update.
        </p>
      </div>
    </Modal>
  );
}