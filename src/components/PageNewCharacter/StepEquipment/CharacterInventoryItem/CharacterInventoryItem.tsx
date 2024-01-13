import { EquipmentItem } from "@/data/definitions";
import { Flex, Typography } from "antd";
import React from "react";

interface CharacterInventoryItemProps {
  item: EquipmentItem;
}

const CharacterInventoryItem: React.FC<
  CharacterInventoryItemProps & React.ComponentPropsWithRef<"div">
> = ({ className, item }) => {
  return (
    <Flex className={className}>
      <Typography.Text>{item.name}</Typography.Text>
      <Typography.Text className="ml-auto">{item.amount}x</Typography.Text>
    </Flex>
  );
};

export default CharacterInventoryItem;
