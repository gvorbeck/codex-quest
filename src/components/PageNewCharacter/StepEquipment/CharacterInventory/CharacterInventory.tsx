import { EquipmentItem } from "@/data/definitions";
import { Flex, List, Typography } from "antd";
import React from "react";
import classNames from "classnames";
import CqDivider from "@/components/CqDivider/CqDivider";

interface CharacterInventoryProps {
  equipment: EquipmentItem[];
}

const CharacterInventory: React.FC<
  CharacterInventoryProps & React.ComponentPropsWithRef<"div">
> = ({ className, equipment }) => {
  const characterInventoryClassNames = classNames("sticky top-0", className);
  const dataSource = [...equipment];
  return (
    <div className={characterInventoryClassNames}>
      <div className="sticky top-0">
        <CqDivider>Inventory</CqDivider>
        <List
          dataSource={dataSource}
          renderItem={(item) => (
            <Flex>
              <Typography.Text>{item.name}</Typography.Text>
              <Typography.Text className="ml-auto">
                {item.amount}x
              </Typography.Text>
            </Flex>
          )}
        />
      </div>
    </div>
  );
};

export default CharacterInventory;
