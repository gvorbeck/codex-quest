import { Button, List, Typography } from "antd";
import { EquipmentItem, EquipmentListProps } from "../types";

export default function EquipmentList({
  character,
  setCharacter,
  categories,
  handleAttack,
  attackBonus,
  setWeapon,
  showAttackModal,
}: EquipmentListProps) {
  let equipmentItems;
  if (typeof categories === "string") {
    equipmentItems = character.equipment
      .filter((items) => items.category === categories)
      .sort((a, b) => a.name.localeCompare(b.name));
  } else {
    equipmentItems = character.equipment
      .filter((item) => categories.includes(item.category))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  const handleAttackClick = (item: EquipmentItem) => {
    if (setWeapon) {
      setWeapon(item);
    }
    if (showAttackModal) {
      showAttackModal();
    }
  };

  return (
    <List
      dataSource={equipmentItems}
      size="small"
      renderItem={(item) => (
        <List.Item className="!block">
          <Typography.Paragraph className="font-bold mb-3">
            {item.name}
          </Typography.Paragraph>
          <div className="flex flex-col text-right italic">
            {item.weight && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  Weight&nbsp;
                </Typography.Text>
                {item.weight}
              </Typography.Text>
            )}
            {item.size && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  Size&nbsp;
                </Typography.Text>
                {item.size}
              </Typography.Text>
            )}
            {item.amount && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  Amount&nbsp;
                </Typography.Text>
                {item.amount}
              </Typography.Text>
            )}
            {item.AC && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  AC&nbsp;
                </Typography.Text>
                {item.AC}
              </Typography.Text>
            )}
            {item.damage && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  Damage&nbsp;
                </Typography.Text>
                {item.damage}
              </Typography.Text>
            )}
          </div>
          {handleAttack && (
            <>
              <div className="text-right mt-3">
                <Button type="primary" onClick={() => handleAttackClick(item)}>
                  Attack
                </Button>
              </div>
            </>
          )}
        </List.Item>
      )}
    />
  );
}
