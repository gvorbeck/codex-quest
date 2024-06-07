import React from "react";
import {
  CharData,
  EquipmentItem,
  ModalDisplay,
  UpdateCharAction,
} from "@/data/definitions";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Flex,
  InputNumber,
  Popconfirm,
  Typography,
  message,
} from "antd";
import { equipmentNames } from "@/support/equipmentSupport";
import { DeleteOutlined } from "@ant-design/icons";
import ModalAttack from "@/components/ModalAttack/ModalAttack";
import { CharacterDataContext } from "@/store/CharacterContext";

interface EquipmentItemDescriptionProps {
  item: EquipmentItem;
  showAttackButton?: boolean;
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
}

const confirm = (
  item: EquipmentItem,
  character: CharData,
  characterDispatch: React.Dispatch<UpdateCharAction>,
) => {
  const characterEquipment = [...character.equipment];
  const itemIndex = characterEquipment.findIndex((e) => e === item);
  characterDispatch({
    type: "UPDATE",
    payload: {
      equipment: characterEquipment.filter((_, i) => i !== itemIndex),
    },
  });
  message.success(`${item.name} deleted`);
};

const cancel = () => {};

const EquipmentItemDescription: React.FC<
  EquipmentItemDescriptionProps & React.ComponentPropsWithRef<"div">
> = ({ className, item, showAttackButton, setModalDisplay }) => {
  const [, contextHolder] = message.useMessage();
  const { character, characterDispatch, userIsOwner } =
    React.useContext(CharacterDataContext);

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

  // Custom ammo items have no way to add more of themselves without this.
  function handleCustomAmmoChange(value: number | null) {
    if (value && !isNaN(value)) {
      characterDispatch({
        type: "UPDATE",
        payload: {
          equipment: character.equipment.map((e) =>
            e === item ? { ...e, amount: value } : e,
          ),
        },
      });
    }
  }

  // InputNumber for custom ammo items, regular amounts are done through settings drawer.
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
    children: !equipmentNames.includes(item.name) ? (
      <InputNumber
        value={item.amount}
        onChange={handleCustomAmmoChange}
        disabled={!userIsOwner}
      />
    ) : (
      item.amount
    ),
  });

  const handleAttackClick = () => {
    if (setModalDisplay) {
      setModalDisplay({
        isOpen: true,
        title: `Attack with ${item.name}`,
        content: <ModalAttack item={item} setModalDisplay={setModalDisplay} />,
      });
    }
  };

  const notes = item.notes ? (
    <Typography.Text>{item.notes}</Typography.Text>
  ) : null;

  const deleteButton = (
    <Popconfirm
      title="Delete equipment item"
      description="Are you sure to delete this item?"
      onConfirm={() => confirm(item, character, characterDispatch)}
      onCancel={cancel}
      okText="Yes"
      cancelText="No"
    >
      <Button icon={<DeleteOutlined />} disabled={!userIsOwner}>
        Delete
      </Button>
    </Popconfirm>
  );
  const deleteCustomEquipmentButton = !equipmentNames.includes(item.name)
    ? item.name !== "Punch**" &&
      item.name !== "Kick**" &&
      character &&
      deleteButton
    : null;

  const attackButton = showAttackButton ? (
    <Button onClick={handleAttackClick} disabled={!userIsOwner}>
      Attack
    </Button>
  ) : null;
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
        {notes}
        <Flex justify="flex-end" gap={16}>
          {deleteCustomEquipmentButton}
          {attackButton}
        </Flex>
      </Flex>
    </>
  );
};

export default EquipmentItemDescription;
