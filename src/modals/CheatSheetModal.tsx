import { Modal } from "antd";
import { CheatSheetModalProps } from "./definitions";
import CloseIcon from "../components/CloseIcon/CloseIcon";

export default function CheatSheetModal({
  isCheatSheetModalOpen,
  handleCancel,
}: CheatSheetModalProps) {
  return (
    <Modal
      title="CHEAT SHEET"
      open={isCheatSheetModalOpen}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<CloseIcon />}
    ></Modal>
  );
}
