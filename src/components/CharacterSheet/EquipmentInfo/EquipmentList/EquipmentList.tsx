import { EquipmentListProps } from "./definitions";
import equipmentItems from "../../../../data/equipment-items.json";
import { Button, Descriptions, Radio, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { EquipmentItem } from "../../../EquipmentStore/definitions";

const itemDescription = (item: EquipmentItem) => (
  <Descriptions bordered size="small" column={1} className="flex-grow">
    {item.weight && (
      <Descriptions.Item label="Weight">{item.weight}</Descriptions.Item>
    )}
    {item.size && (
      <Descriptions.Item label="Size">{item.size}</Descriptions.Item>
    )}
    {item.amount && item.name !== "Punch" && item.name !== "Kick" && (
      <Descriptions.Item label="Amount">{item.amount}</Descriptions.Item>
    )}
    {item.AC && <Descriptions.Item label="AC">{item.AC}</Descriptions.Item>}
    {item.damage && (
      <Descriptions.Item label="Damage">{item.damage}</Descriptions.Item>
    )}
  </Descriptions>
);

const punchItem = {
  name: "Punch",
  costValue: 0,
  costCurrency: "gp",
  category: "weapons",
  damage: "1d3",
  amount: 1,
  type: "melee",
};

const kickItem = {
  name: "Kick",
  costValue: 0,
  costCurrency: "gp",
  category: "weapons",
  damage: "1d4",
  amount: 1,
  type: "melee",
};

export default function EquipmentList({
  characterData,
  setCharacterData,
  categories,
  handleCustomDelete,
  handleAttack,
  handleAttackClick,
  updateAC,
}: EquipmentListProps) {
  const shownItems = characterData.equipment
    .filter((item) => categories.includes(item.category))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleUpdateAC = (item: string, type: string) => {
    const oldArmor = characterData.wearing?.armor;
    const oldShield = characterData.wearing?.shield;

    setCharacterData({
      ...characterData,
      wearing: {
        armor: characterData.wearing?.armor || "",
        shield: characterData.wearing?.shield || "",
        [type]: item,
      },
    });

    const newArmor = characterData.wearing?.armor;
    const newShield = characterData.wearing?.shield;

    if (oldArmor !== newArmor || oldShield !== newShield) {
      updateAC && updateAC();
    }
  };

  return categories.includes("armor") || categories.includes("shields") ? (
    <Radio.Group
      className="flex flex-col [&>*+*]:mt-4"
      size="small"
      value={
        categories.includes("armor")
          ? characterData.wearing?.armor
          : characterData.wearing?.shield
      }
      onChange={(e) => {
        const type = categories.includes("armor") ? "armor" : "shield";
        handleUpdateAC(e.target.value, type);
      }}
    >
      {categories.includes("armor") && (
        <Radio value="">
          <Typography.Paragraph className="font-bold mb-3">
            No Armor
          </Typography.Paragraph>
        </Radio>
      )}
      {categories.includes("shields") && (
        <Radio value="">
          <Typography.Paragraph className="font-bold mb-3">
            No Shield
          </Typography.Paragraph>
        </Radio>
      )}
      {shownItems.map((item) => {
        // Ignore previously existing "NO X" items in characters' equipment.
        if (item.name === "No Shield" || item.name === "No Armor") return null;
        return (
          <Radio
            key={item.name}
            value={item.name}
            className="[&>span:last-child]:w-full"
          >
            <div>
              <Typography.Paragraph className="font-bold mb-3">
                {item.name}
              </Typography.Paragraph>
              {!equipmentItems.some(
                (equipmentItem) => equipmentItem.name === item.name
              ) &&
                characterData.wearing &&
                item.name !== characterData.wearing.armor &&
                item.name !== characterData.wearing.shield && (
                  <Button
                    type="default"
                    icon={<DeleteOutlined />}
                    shape="circle"
                    onClick={() => handleCustomDelete(item)}
                  />
                )}
            </div>
            {itemDescription(item)}
          </Radio>
        );
      })}
    </Radio.Group>
  ) : (
    <div className="[&>div+div]:mt-4">
      {categories.includes("weapons") && (
        <>
          <div>
            <div className="flex items-baseline gap-4">
              <Typography.Paragraph className="font-bold mb-3">
                Punch**
              </Typography.Paragraph>
            </div>
            {itemDescription(punchItem)}
            {handleAttack && handleAttackClick && (
              <>
                <div className="text-right mt-3">
                  <Button
                    type="primary"
                    onClick={() => handleAttackClick(punchItem)}
                  >
                    Attack
                  </Button>
                </div>
              </>
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-4">
              <Typography.Paragraph className="font-bold mb-3">
                Kick**
              </Typography.Paragraph>
            </div>
            {itemDescription(kickItem)}
            {handleAttack && handleAttackClick && (
              <>
                <div className="text-right mt-3">
                  <Button
                    type="primary"
                    onClick={() => handleAttackClick(kickItem)}
                  >
                    Attack
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
      {shownItems.map((item) => (
        <div key={item.name}>
          <div className="flex items-baseline gap-4">
            <Typography.Paragraph className="font-bold mb-3">
              {item.name}
            </Typography.Paragraph>
            {!equipmentItems.some(
              (equipmentItem) => equipmentItem.name === item.name
            ) && (
              <Button
                type="default"
                icon={<DeleteOutlined />}
                shape="circle"
                onClick={() => handleCustomDelete(item)}
              />
            )}
          </div>
          {itemDescription(item)}
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
      ))}
    </div>
  );
}
