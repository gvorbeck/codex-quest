import { EquipmentListProps } from "./definitions";
import equipmentItems from "../../../../data/equipmentItems.json";
import { Button, Radio, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import WeaponKeys from "../../../WeaponKeys/WeaponKeys";
import ItemWrapper from "./ItemWrapper/ItemWrapper";
import ItemDescription from "./ItemDescription/ItemDescription";
import { EquipmentItem } from "../../../EquipmentStore/definitions";
import { ClassNamesTwo, classes } from "../../../../data/classes";

const punchItem: EquipmentItem = {
  name: "Punch**",
  costValue: 0,
  costCurrency: "gp",
  category: "inherent",
  damage: "1d3",
  amount: 1,
  type: "melee",
  noDelete: true,
};

const kickItem: EquipmentItem = {
  name: "Kick**",
  costValue: 0,
  costCurrency: "gp",
  category: "inherent",
  damage: "1d4",
  amount: 1,
  type: "melee",
  noDelete: true,
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
            <ItemDescription item={item} />
          </Radio>
        );
      })}
    </Radio.Group>
  ) : (
    <div className="[&>div+div]:mt-4">
      {categories.includes("weapons") && (
        <>
          <ItemWrapper
            item={punchItem}
            handleAttackClick={handleAttackClick}
            handleAttack={handleAttack}
            handleCustomDelete={handleCustomDelete}
          />
          <ItemWrapper
            item={kickItem}
            handleAttackClick={handleAttackClick}
            handleAttack={handleAttack}
            handleCustomDelete={handleCustomDelete}
          />
          {classes[characterData.class as ClassNamesTwo].powers?.map(
            (power) => (
              <ItemWrapper
                item={power}
                handleAttackClick={handleAttackClick}
                handleAttack={handleAttack}
                handleCustomDelete={handleCustomDelete}
              />
            )
          )}
        </>
      )}
      {shownItems.map((item) => (
        <ItemWrapper
          item={item}
          handleCustomDelete={handleCustomDelete}
          handleAttack={handleAttack}
          handleAttackClick={handleAttackClick}
          key={item.name}
        />
      ))}
      {categories.includes("weapons") && <WeaponKeys />}
    </div>
  );
}
