import { Flex } from "antd";
import React from "react";
import CollapseEquipment from "../CollapseEquipment/CollapseEquipment";
import EquipmentItemDescription from "../CollapseEquipment/EquipmentItemDescription/EquipmentItemDescription";
import { kickItem, punchItem } from "@/support/equipmentSupport";
import { ModalDisplay } from "@/data/definitions";

interface EquipmentProps {
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
}

const Equipment: React.FC<
  EquipmentProps & React.ComponentPropsWithRef<"div">
> = ({ className, setModalDisplay }) => {
  return (
    <Flex vertical gap={16} className={className}>
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
