import {
  Alert,
  Collapse,
  CollapseProps,
  Descriptions,
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
  CharData,
  EquipmentCategories,
  EquipmentCategoriesWeapons,
  EquipmentItem,
} from "@/data/definitions";
import EquipmentItemDescription from "./EquipmentItemDescription/EquipmentItemDescription";
import WearingRadioGroup from "./WearingRadioGroup/WearingRadioGroup";

interface CollapseEquipmentProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  onCharacterSheet?: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  setModalTitle: (modalTitle: string) => void;
  setModalContent: (modalContent: React.ReactNode) => void;
}

const CollapseEquipment: React.FC<
  CollapseEquipmentProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  character,
  setCharacter,
  onCharacterSheet,
  setModalIsOpen,
  setModalTitle,
  setModalContent,
}) => {
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
                    character={character}
                    setCharacter={setCharacter}
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
                setModalIsOpen={setModalIsOpen}
                setModalTitle={setModalTitle}
                setModalContent={setModalContent}
                character={character}
                setCharacter={setCharacter}
              />
            ))
          )}
        </Flex>
      ),
    }));

  return (
    <Flex vertical gap={16}>
      <Collapse className={className} items={items} />
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
