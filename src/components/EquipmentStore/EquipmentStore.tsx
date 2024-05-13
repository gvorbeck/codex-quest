import {
  Alert,
  Collapse,
  CollapseProps,
  Descriptions,
  DescriptionsProps,
  Flex,
  Input,
} from "antd";
import equipmentData from "@/data/equipment.json";
import {
  CharData,
  ClassNames,
  EquipmentCategories,
  EquipmentItem,
} from "@/data/definitions";
import { slugToTitleCase } from "@/support/stringSupport";
import { classes } from "@/data/classes";
import { ClassSetup } from "@/data/classes/definitions";
import EquipmentStoreItem from "./EquipmentStoreItem/EquipmentStoreItem";
import React from "react";
import { getClassType } from "@/support/classSupport";

interface EquipmentStoreProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
}

const EquipmentStore: React.FC<
  EquipmentStoreProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  const [search, setSearch] = React.useState("");

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value.toLowerCase());
  }

  function getEquipmentCategoryChildren(category: string) {
    return equipmentData
      .filter((item) => item.category === category)
      .filter((item) => item.name.toLowerCase().includes(search));
  }

  function getEquipmentCategoryItems() {
    const items: CollapseProps["items"] = [];
    const classProps: Record<string, ClassSetup> = {};
    const classTypes = getClassType(character.class);
    // Assume all categories are available if any class is 'custom'
    const isCustomClass = classTypes.includes("custom");

    // Setting up class properties based on the character's class array.
    for (const className of character.class) {
      classProps[className] = classes[className as ClassNames] ?? {};
    }

    for (const [key, value] of Object.entries(EquipmentCategories)) {
      // Check if any class has this equipment category available
      let isCategoryAvailable = isCustomClass;
      if (!isCustomClass) {
        for (const classSetup of Object.values(classProps)) {
          if (classSetup.availableEquipmentCategories?.includes(value)) {
            isCategoryAvailable = true;
            break; // Stop searching once we find a match
          }
        }
      }

      if (isCategoryAvailable) {
        const filteredItems = getEquipmentCategoryChildren(value);
        if (filteredItems.length > 0) {
          if (value === "general-equipment") {
            // Map to organize items by subCategory
            const subCategoryMap: Record<string, EquipmentItem[]> = {};

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filteredItems.forEach((item: any) => {
              const category = item.subCategory || "Other";
              if (!subCategoryMap[category]) {
                subCategoryMap[category] = [];
              }
              subCategoryMap[category].push(item);
            });

            // Create Collapse items for each subCategory
            const generalEquipmentItems: CollapseProps["items"] =
              Object.entries(subCategoryMap).map(
                ([subCategoryKey, subCategoryItems]) => ({
                  key: subCategoryKey,
                  label: slugToTitleCase(subCategoryKey),
                  children: (
                    <Flex gap={16} vertical>
                      {subCategoryItems.map((equipmentItem) => (
                        <EquipmentStoreItem
                          key={equipmentItem.name}
                          item={equipmentItem as EquipmentItem}
                          character={character}
                          setCharacter={setCharacter}
                        />
                      ))}
                    </Flex>
                  ),
                }),
              );

            items.push({
              key,
              label: slugToTitleCase(value),
              children: <Collapse ghost items={generalEquipmentItems} />,
            });
          } else {
            items.push({
              key,
              label: slugToTitleCase(value),
              children: (
                <Flex gap={16} vertical>
                  {filteredItems.map((equipmentItem) => (
                    <EquipmentStoreItem
                      key={equipmentItem.name}
                      item={equipmentItem as EquipmentItem}
                      character={character}
                      setCharacter={setCharacter}
                    />
                  ))}
                </Flex>
              ),
            });
          }
        }
      }
    }
    return items.sort((a, b) => {
      const labelA = typeof a.label === "string" ? a.label : "";
      const labelB = typeof b.label === "string" ? b.label : "";
      return labelA.localeCompare(labelB);
    });
  }

  const items: CollapseProps["items"] = getEquipmentCategoryItems();
  const descriptionsItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "**",
      children: "This weapon only does subduing damage",
    },
    {
      key: "2",
      label: "(E)",
      children:
        "Entangling: This weapon may be used to snare or hold opponents.",
    },
    {
      key: "3",
      label: "†",
      children: "Silver tip or blade, for use against lycanthropes.",
    },
  ];

  return (
    <Flex gap={8} vertical className={className}>
      <Input
        placeholder="Filter equipment list"
        value={search}
        onChange={handleSearchChange}
      />
      <Collapse items={items} />
      <Alert
        type="info"
        message={
          <Descriptions
            size="small"
            items={descriptionsItems}
            column={1}
            contentStyle={{ fontSize: ".75rem" }}
          />
        }
      />
    </Flex>
  );
};

export default EquipmentStore;
