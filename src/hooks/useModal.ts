// useModal.js
import React from "react";

interface UseModalReturnType {
  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  modalTitle: string;
  setModalTitle: (modalTitle: string) => void;
  modalContent: React.ReactNode | undefined;
  setModalContent: (modalContent: React.ReactNode) => void;
  modalOkRef: React.RefObject<(() => void | undefined) | undefined>;
}

export const useModal = (): UseModalReturnType => {
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
  const [modalTitle, setModalTitle] = React.useState<string>("");
  const [modalContent, setModalContent] = React.useState<
    React.ReactNode | undefined
  >(undefined);
  const modalOkRef = React.useRef<(() => void | undefined) | undefined>(
    undefined,
  );

  return {
    modalIsOpen,
    setModalIsOpen,
    modalTitle,
    setModalTitle,
    modalContent,
    setModalContent,
    modalOkRef,
  };
};
