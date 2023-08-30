import { Button, Typography } from "antd";
import { ItemWrapperProps } from "./definitions";
import ItemDescription from "../ItemDescription/ItemDescription";
import { DeleteOutlined } from "@ant-design/icons";
import equipmentItems from "../../../../../data/equipmentItems.json";

export default function ItemWrapper({
  item,
  handleAttack,
  handleAttackClick,
  handleCustomDelete,
}: ItemWrapperProps) {
  return (
    <div>
      <div className="flex items-baseline gap-4">
        <Typography.Paragraph className="font-bold mb-3">
          {item.name}
        </Typography.Paragraph>
        {!equipmentItems.some(
          (equipmentItem) => equipmentItem.name === item.name
        ) &&
          !item.noDelete && (
            <Button
              type="default"
              icon={<DeleteOutlined />}
              shape="circle"
              onClick={() => handleCustomDelete(item)}
            />
          )}
      </div>
      <ItemDescription item={item} />
      {handleAttack && handleAttackClick && (
        <>
          <div className="text-right mt-3">
            <Button type="primary" onClick={() => handleAttackClick(item)}>
              Attack
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
