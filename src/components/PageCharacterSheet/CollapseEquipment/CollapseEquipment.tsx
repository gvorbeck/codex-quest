import {
  Alert,
  Collapse,
  CollapseProps,
  Descriptions,
  Empty,
  Flex,
  Radio,
} from "antd";
import React from "react";
import { slugToTitleCase } from "@/support/stringSupport";
import {
  equipmentCategoryMap,
  equipmentSymbolKeyItems,
  onChangeWearing,
} from "@/support/equipmentSupport";
import {
  EquipmentCategories,
  EquipmentCategoriesWeapons,
  EquipmentItem,
  ModalDisplay,
} from "@/data/definitions";
import EquipmentItemDescription from "./EquipmentItemDescription/EquipmentItemDescription";
import WearingRadioGroup from "./WearingRadioGroup/WearingRadioGroup";
import { CharacterDataContext } from "@/store/CharacterContext";

interface CollapseEquipmentProps {
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
  onCharacterSheet?: boolean;
}

const CollapseEquipment: React.FC<
  CollapseEquipmentProps & React.ComponentPropsWithRef<"div">
> = ({ className, setModalDisplay, onCharacterSheet }) => {
  const { character, setCharacter } = React.useContext(CharacterDataContext);
  const items: CollapseProps["items"] = Object.entries(
    equipmentCategoryMap(character.equipment),
  )
    .sort()
    .map((category, index) => ({
      key: index + 1 + "",
      label: slugToTitleCase(category[0]),
      children: (
        <Flex vertical gap={16}>
          {category[0] === EquipmentCategories.ARMOR ||
          category[0] === EquipmentCategories.SHIELDS ? (
            <WearingRadioGroup
              category={category[0]}
              value={
                category[0] === EquipmentCategories.ARMOR
                  ? character.wearing?.armor
                  : character.wearing?.shield
              }
              onChangeWearing={(e) => {
                if (
                  category[0] === EquipmentCategories.ARMOR ||
                  category[0] === EquipmentCategories.SHIELDS
                ) {
                  onChangeWearing(
                    e,
                    category[0] as "armor" | "shields",
                    character,
                    setCharacter,
                  );
                }
              }}
            >
              {category[1].map((item: EquipmentItem, index: number) => (
                <Radio
                  className="flex gap-4 [&>span:last-child]:w-full [&>span:last-child]:block [&:after]:hidden m-0"
                  key={index}
                  value={item.name}
                >
                  <EquipmentItemDescription
                    item={item}
                    className="flex-grow"
                    setModalDisplay={setModalDisplay}
                  />
                </Radio>
              ))}
            </WearingRadioGroup>
          ) : (
            category[1].map((item: EquipmentItem, index: number) => (
              <EquipmentItemDescription
                item={item}
                key={index}
                showAttackButton={
                  Object.values(EquipmentCategoriesWeapons).includes(
                    category[0] as EquipmentCategoriesWeapons,
                  ) && onCharacterSheet
                }
                setModalDisplay={setModalDisplay}
              />
            ))
          )}
        </Flex>
      ),
    }));

  const collapseContent = items.length ? (
    <Collapse className={className} items={items} />
  ) : (
    <Empty description="No Equipment" />
  );

  return (
    <Flex vertical gap={16}>
      {collapseContent}
      <Alert
        type="info"
        message={
          <Descriptions
            size="small"
            items={equipmentSymbolKeyItems}
            column={1}
            contentStyle={{ fontSize: ".75rem" }}
          />
        }
      />
    </Flex>
  );
};

export default CollapseEquipment;
