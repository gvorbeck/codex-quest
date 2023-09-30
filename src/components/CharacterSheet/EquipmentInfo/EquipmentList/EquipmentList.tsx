import { EquipmentListProps } from "./definitions";
import equipmentItems from "../../../../data/equipmentItems.json";
import { Button, Empty, Radio, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import WeaponKeys from "../../../WeaponKeys/WeaponKeys";
import ItemWrapper from "./ItemWrapper/ItemWrapper";
import ItemDescription from "./ItemDescription/ItemDescription";
import { classes } from "../../../../data/classes";
import { useEffect } from "react";
import {
  ClassNames,
  EquipmentItem,
  RaceNames,
} from "../../../../data/definitions";
import { races } from "../../../../data/races";

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
    .filter((item: EquipmentItem) => categories.includes(item.category))
    .sort((a: EquipmentItem, b: EquipmentItem) => a.name.localeCompare(b.name));

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

  const EmptyRadio = ({ label }: { label: string }) => (
    <Radio value="">
      <Typography.Text className="font-bold mb-3">{label}</Typography.Text>
    </Radio>
  );

  useEffect(() => {
    // Remove empty items from the equipment array.
    const remainingEquipment = characterData.equipment.filter(
      (item: EquipmentItem) => item.amount !== 0
    );
    if (remainingEquipment.length !== characterData.equipment.length) {
      setCharacterData({ ...characterData, equipment: remainingEquipment });
    }
  }, [characterData.equipment]);

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
      {categories.includes("armor") && <EmptyRadio label="No Armor" />}
      {categories.includes("shields") && <EmptyRadio label="No Shield" />}
      {shownItems.map((item: EquipmentItem) => {
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
    // Weapon Items
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
          {races[characterData.race as RaceNames]?.uniqueAttacks?.map(
            (attack) => (
              <ItemWrapper
                key={attack.name}
                item={attack}
                handleAttackClick={handleAttackClick}
                handleAttack={handleAttack}
                handleCustomDelete={handleCustomDelete}
              />
            )
          )}
          {characterData.class.map(
            (className) =>
              classes[className as ClassNames]?.powers?.map((power) => {
                return (
                  characterData.level >= (power.minLevel ?? 0) && (
                    <ItemWrapper
                      key={power.name}
                      item={power}
                      handleAttackClick={handleAttackClick}
                      handleAttack={handleAttack}
                      handleCustomDelete={handleCustomDelete}
                    />
                  )
                );
              })
          )}
        </>
      )}
      {/* STARTING EQUIPMENT */}
      {categories.includes("general-equipment") &&
        characterData.class.map(
          (className) =>
            classes[className as ClassNames]?.startingEquipment?.map(
              (item: EquipmentItem) => (
                <ItemWrapper
                  item={item}
                  handleCustomDelete={handleCustomDelete}
                  handleAttack={handleAttack}
                  handleAttackClick={handleAttackClick}
                  key={item.name}
                />
              )
            )
        )}
      {shownItems.length > 0 ? (
        shownItems.map((item: EquipmentItem) => (
          <ItemWrapper
            item={item}
            handleCustomDelete={handleCustomDelete}
            handleAttack={handleAttack}
            handleAttackClick={handleAttackClick}
            key={item.name}
          />
        ))
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No equipment in this category"
        />
      )}
      {categories.includes("weapons") && <WeaponKeys />}
    </div>
  );
}
