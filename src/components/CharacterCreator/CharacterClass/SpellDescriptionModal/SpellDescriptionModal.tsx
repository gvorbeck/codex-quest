import { Modal } from "antd";
import CloseIcon from "../../../CloseIcon/CloseIcon";

type SpellDescriptionModalProps = {
  title: string;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  description: string;
};

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
