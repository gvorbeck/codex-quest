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
  const { character, characterDispatch } =
    React.useContext(CharacterDataContext);
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
                    characterDispatch,
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
                    className="grow"
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

  React.useEffect(() => {
    // Do a filter on character.equipment and remove items with amount 0
    // then compare to original character.equipment and update if necessary.
    const equipment = character.equipment.filter((item) => item.amount > 0);
    if (equipment.length !== character.equipment.length) {
      characterDispatch({
        type: "UPDATE",
        payload: { equipment },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
