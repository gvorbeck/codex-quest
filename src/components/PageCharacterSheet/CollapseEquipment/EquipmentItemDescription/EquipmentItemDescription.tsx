import React from "react";
import { CharData, EquipmentItem } from "@/data/definitions";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Flex,
  Popconfirm,
  message,
} from "antd";
import { equipmentNames } from "@/support/equipmentSupport";
import { DeleteOutlined } from "@ant-design/icons";
import ModalAttack from "@/components/ModalAttack/ModalAttack";

interface EquipmentItemDescriptionProps {
  item: EquipmentItem;
  showAttackButton?: boolean;
  character?: CharData;
  setCharacter?: (character: CharData) => void;
  setModalIsOpen?: (modalIsOpen: boolean) => void;
  setModalTitle?: (modalTitle: string) => void;
  setModalContent?: (modalContent: React.ReactNode) => void;
  userIsOwner?: boolean;
}

const confirm = (
  item: EquipmentItem,
  character: CharData,
  setCharacter: (character: CharData) => void,
) => {
  message.success(`${item.name} deleted`);
  setCharacter({
    ...character,
    equipment: character.equipment.filter((e) => e.name !== item.name),
  });
};

const cancel = () => {};

const EquipmentItemDescription: React.FC<
  EquipmentItemDescriptionProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  item,
  showAttackButton,
  setModalIsOpen,
  setModalTitle,
  character,
  setCharacter,
  setModalContent,
  userIsOwner,
}) => {
  const [, contextHolder] = message.useMessage();

  const damageItem = {
    key: "damage",
    label: "Damage",
    children: item.damage,
  };
  const sizeItem = { key: "size", label: "Size", children: item.size };
  const weightItem = {
    key: "weight",
    label: "Weight",
    children: item.weight,
  };
  const acItem = { key: "ac", label: "AC", children: item.AC };
  const missileACItem = {
    key: "missileAC",
    label: "Missile AC",
    children: item.missileAC,
  };
  const rangeItem = {
    key: "range",
    label: "Range",
    children: item.range?.join(" / "),
  };
  const ammoItem = {
    key: "ammo",
    label: "Ammo",
    children: <span className="text-xs">{item.ammo?.join(", ")}</span>,
    span: 2,
  };
  const items: DescriptionsProps["items"] = [
    {
      key: "name",
      label: "Name",
      children: <span className="font-bold">{item.name}</span>,
      span: 3,
    },
    {
      key: "cost",
      label: "Cost",
      children: item.costValue + " " + item.costCurrency,
    },
  ];

  if (item.weight) items.push(weightItem);
  if (item.size) items.push(sizeItem);
  if (item.damage) items.push(damageItem);
  if (item.AC) items.push(acItem);
  if (item.missileAC) items.push(missileACItem);
  if (item.range) items.push(rangeItem);
  if (item.ammo) items.push(ammoItem);
  items.push({
    key: "amount",
    label: "Amount",
    children: item.amount,
  });

  const handleAttackClick = () => {
    if (
      setModalIsOpen &&
      setModalTitle &&
      setModalContent &&
      character &&
      setCharacter
    ) {
      setModalIsOpen(true);
      setModalTitle(`Attack with ${item.name}`);
      setModalContent(
        <ModalAttack
          item={item}
          equipment={character.equipment}
          setModalIsOpen={setModalIsOpen}
          character={character}
          setCharacter={setCharacter}
        />,
      );
    }
  };
  return (
    <>
      {contextHolder}
      <Flex vertical gap={16}>
        <Descriptions
          size="small"
          bordered
          className={className}
          items={items}
          column={3}
        />
        <Flex justify="flex-end" gap={16}>
          {!equipmentNames.includes(item.name) &&
            item.name !== "Punch**" &&
            item.name !== "Kick**" &&
            character &&
            setCharacter && (
              <Popconfirm
                title="Delete equipment item"
                description="Are you sure to delete this item?"
                onConfirm={() => confirm(item, character, setCharacter)}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} disabled={!userIsOwner}>
                  Delete
                </Button>
              </Popconfirm>
            )}
          {showAttackButton && (
            <Button onClick={handleAttackClick} disabled={!userIsOwner}>
              Attack
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default EquipmentItemDescription;
