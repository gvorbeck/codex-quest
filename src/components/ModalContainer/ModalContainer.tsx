import { Modal } from "antd";
import React from "react";

interface ModalContainerProps {
  title: string;
  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  modalContent: React.ReactNode | undefined;
  modalOk?: (() => void | undefined) | null | undefined;
}

const ModalContainer: React.FC<
  ModalContainerProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  title,
  modalIsOpen,
  setModalIsOpen,
  modalContent,
  modalOk,
}) => {
  const handleOk = () => {
    if (modalOk) modalOk();
    setModalIsOpen(false);
  };

  const handleCancel = () => {
    setModalIsOpen(false);
  };
  return (
    <Modal
      title={title}
      open={modalIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className={className}
      footer={false}
      width={900}
    >
      {modalContent}
    </Modal>
  );
};

export default ModalContainer;
