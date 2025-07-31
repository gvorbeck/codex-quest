import { Button, Flex } from "antd";
import React from "react";
import CollapseEquipment from "../CollapseEquipment/CollapseEquipment";
import EquipmentItemDescription from "../CollapseEquipment/EquipmentItemDescription/EquipmentItemDescription";
import { kickItem, punchItem } from "@/support/equipmentSupport";
import { ModalDisplay } from "@/data/definitions";
import { ShoppingOutlined } from "@ant-design/icons";
import { CharacterDataContext } from "@/store/CharacterContext";
import StepEquipment from "@/components/PageNewCharacter/StepEquipment/StepEquipment";

interface EquipmentProps {
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
}

const Equipment: React.FC<
  EquipmentProps & React.ComponentPropsWithRef<"div">
> = ({ className, setModalDisplay }) => {
  const { character, characterDispatch, userIsOwner } =
    React.useContext(CharacterDataContext);
  const [showEquipmentStore, setShowEquipmentStore] = React.useState(false);

  const handleManageEquipmentClick = () => {
    setShowEquipmentStore(!showEquipmentStore);
  };

  return (
    <Flex vertical gap={16} className={className}>
      {userIsOwner && (
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          onClick={handleManageEquipmentClick}
          size="small"
        >
          {showEquipmentStore ? "Hide Equipment Store" : "Manage Equipment"}
        </Button>
      )}

      {showEquipmentStore && (
        <StepEquipment
          character={character}
          characterDispatch={characterDispatch}
          hideDiceButton
          hideInventory
        />
      )}

      <Flex gap={16} vertical>
        <EquipmentItemDescription
          item={kickItem}
          showAttackButton
          setModalDisplay={setModalDisplay}
        />
        <EquipmentItemDescription
          item={punchItem}
          showAttackButton
          setModalDisplay={setModalDisplay}
        />
      </Flex>
      <CollapseEquipment onCharacterSheet setModalDisplay={setModalDisplay} />
    </Flex>
  );
};

export default Equipment;
