import { Button, Flex } from "antd";
import React from "react";
import CollapseEquipment from "../CollapseEquipment/CollapseEquipment";
import EquipmentItemDescription from "../CollapseEquipment/EquipmentItemDescription/EquipmentItemDescription";
import { kickItem, punchItem } from "@/support/equipmentSupport";
import ModalCustomEquipment from "@/components/ModalCustomEquipment/ModalCustomEquipment";
import StepEquipment from "@/components/PageNewCharacter/StepEquipment/StepEquipment";
import { CharacterDataContext } from "@/contexts/CharacterContext";

interface EquipmentProps {
  setModalIsOpen: (modalIsOpen: boolean) => void;
  setModalTitle: (modalTitle: string) => void;
  setModalContent: (modalContent: React.ReactNode) => void;
}

const Equipment: React.FC<
  EquipmentProps & React.ComponentPropsWithRef<"div">
> = ({ className, setModalIsOpen, setModalTitle, setModalContent }) => {
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
  return (
    <Flex vertical gap={16} className={className}>
      <Flex vertical gap={16}>
        <Button disabled={!userIsOwner} onClick={handleEditEquipmentClick}>
          Add/Edit Equipment
        </Button>
        <Button disabled={!userIsOwner} onClick={handleCustomEquipmentClick}>
          Add Custom Equipment
        </Button>
      </Flex>
      <Flex gap={16} vertical>
        <EquipmentItemDescription
          item={kickItem}
          showAttackButton
          setModalIsOpen={setModalIsOpen}
          setModalTitle={setModalTitle}
        />
        <EquipmentItemDescription
          item={punchItem}
          showAttackButton
          setModalIsOpen={setModalIsOpen}
          setModalTitle={setModalTitle}
          setModalContent={setModalContent}
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
