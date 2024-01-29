import { Button, Flex } from "antd";
import React from "react";
import CollapseEquipment from "../CollapseEquipment/CollapseEquipment";
import EquipmentItemDescription from "../CollapseEquipment/EquipmentItemDescription/EquipmentItemDescription";
import { kickItem, punchItem } from "@/support/equipmentSupport";
import ModalCustomEquipment from "@/components/ModalCustomEquipment/ModalCustomEquipment";
import StepEquipment from "@/components/PageNewCharacter/StepEquipment/StepEquipment";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import { useDeviceType } from "@/hooks/useDeviceType";
import classNames from "classnames";

interface EquipmentProps {
  setModalIsOpen: (modalIsOpen: boolean) => void;
  setModalTitle: (modalTitle: string) => void;
  setModalContent: (modalContent: React.ReactNode) => void;
}

const Equipment: React.FC<
  EquipmentProps & React.ComponentPropsWithRef<"div">
> = ({ className, setModalIsOpen, setModalTitle, setModalContent }) => {
  const { isMobile } = useDeviceType();
  const { character, setCharacter, userIsOwner } =
    React.useContext(CharacterDataContext);
  const handleEditEquipmentClick = () => {
    setModalIsOpen(true);
    setModalTitle("Add/Edit Equipment");
    setModalContent(
      <StepEquipment
        character={character}
        setCharacter={setCharacter}
        hideDiceButton
        hideInventory
      />,
    );
  };
  const handleCustomEquipmentClick = () => {
    setModalIsOpen(true);
    setModalTitle("Add Custom Equipment");
    setModalContent(
      <ModalCustomEquipment
        character={character}
        setCharacter={setCharacter}
        setModalIsOpen={setModalIsOpen}
      />,
    );
  };
  const addEquipmentClassNames = classNames(
    { "w-1/2": !isMobile },
    "flex-grow",
  );
  return (
    <Flex vertical gap={16} className={className}>
      <Flex gap={16} vertical={isMobile}>
        <Button
          disabled={!userIsOwner}
          onClick={handleEditEquipmentClick}
          className={addEquipmentClassNames}
        >
          Add/Edit Equipment
        </Button>
        <Button
          disabled={!userIsOwner}
          onClick={handleCustomEquipmentClick}
          className={addEquipmentClassNames}
        >
          Add Custom Equipment
        </Button>
      </Flex>
      <Flex gap={16} vertical>
        <EquipmentItemDescription
          item={kickItem}
          showAttackButton
          setModalIsOpen={setModalIsOpen}
          setModalTitle={setModalTitle}
          character={character}
          setCharacter={setCharacter}
          setModalContent={setModalContent}
        />
        <EquipmentItemDescription
          item={punchItem}
          showAttackButton
          setModalIsOpen={setModalIsOpen}
          setModalTitle={setModalTitle}
          setModalContent={setModalContent}
          character={character}
          setCharacter={setCharacter}
        />
      </Flex>
      <CollapseEquipment
        character={character}
        setCharacter={setCharacter}
        onCharacterSheet
        setModalIsOpen={setModalIsOpen}
        setModalTitle={setModalTitle}
        setModalContent={setModalContent}
      />
    </Flex>
  );
};

export default Equipment;
