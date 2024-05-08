import { Flex } from "antd";
import React from "react";
import CollapseEquipment from "../CollapseEquipment/CollapseEquipment";
import EquipmentItemDescription from "../CollapseEquipment/EquipmentItemDescription/EquipmentItemDescription";
import { kickItem, punchItem } from "@/support/equipmentSupport";
import { CharacterDataContext } from "@/store/CharacterContext";

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
  return (
    <Flex vertical gap={16} className={className}>
      <Flex gap={16} vertical>
        <EquipmentItemDescription
          item={kickItem}
          showAttackButton
          setModalIsOpen={setModalIsOpen}
          setModalTitle={setModalTitle}
          character={character}
          setCharacter={setCharacter}
          setModalContent={setModalContent}
          userIsOwner={userIsOwner}
        />
        <EquipmentItemDescription
          item={punchItem}
          showAttackButton
          setModalIsOpen={setModalIsOpen}
          setModalTitle={setModalTitle}
          setModalContent={setModalContent}
          character={character}
          setCharacter={setCharacter}
          userIsOwner={userIsOwner}
        />
      </Flex>
      <CollapseEquipment
        character={character}
        setCharacter={setCharacter}
        onCharacterSheet
        setModalIsOpen={setModalIsOpen}
        setModalTitle={setModalTitle}
        setModalContent={setModalContent}
        userIsOwner={userIsOwner}
      />
    </Flex>
  );
};

export default Equipment;
