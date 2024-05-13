import { ModalDisplay } from "@/data/definitions";
import { Modal } from "antd";
import React from "react";

interface ModalContainerProps {
  modalDisplay: ModalDisplay;
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
  modalOk?: (() => void | undefined) | null | undefined;
}

const ModalContainer: React.FC<
  ModalContainerProps & React.ComponentPropsWithRef<"div">
> = ({ className, modalDisplay, setModalDisplay, modalOk }) => {
  function handleOk() {
    if (modalOk) modalOk();
    setModalDisplay((prevModalDisplay) => ({
      ...prevModalDisplay,
      isOpen: false,
    }));
  }

  function handleCancel() {
    setModalDisplay((prevModalDisplay) => ({
      ...prevModalDisplay,
      isOpen: false,
    }));
  }

  return (
    <Modal
      title={modalDisplay.title}
      open={modalDisplay.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className={className}
      footer={false}
      width={900}
    >
      {modalDisplay.content}
    </Modal>
  );
};

export default ModalContainer;
