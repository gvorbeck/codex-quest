import { Modal } from "antd";
import { SpellDescriptionModalProps } from "./definitions";
import CloseIcon from "../../../CloseIcon/CloseIcon";

export default function SpellDescriptionModal({
  title,
  isModalOpen,
  setIsModalOpen,
  description,
}: SpellDescriptionModalProps) {
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[]}
      closeIcon={<CloseIcon />}
    >
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </Modal>
  );
}
