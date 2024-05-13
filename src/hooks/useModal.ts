// useModal.js
import { ModalDisplay } from "@/data/definitions";
import React from "react";

interface UseModalReturnType {
  modalDisplay: ModalDisplay;
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
  modalOkRef: React.RefObject<(() => void | undefined) | undefined>;
}

export const useModal = (): UseModalReturnType => {
  const [modalDisplay, setModalDisplay] = React.useState<ModalDisplay>({
    isOpen: false,
    title: "",
    content: undefined,
  });
  const modalOkRef = React.useRef<(() => void | undefined) | undefined>(
    undefined,
  );

  return {
    modalDisplay,
    setModalDisplay,
    modalOkRef,
  };
};
