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
  UpdateCharAction,
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
  characterDispatch: React.Dispatch<UpdateCharAction>;
}

const EquipmentStore: React.FC<
  EquipmentStoreProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, characterDispatch }) => {
  const [search, setSearch] = React.useState("");
  const [activeKeys, setActiveKeys] = React.useState<string[]>([]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = event.target.value.toLowerCase();
    setSearch(searchValue);

    // Auto-expand categories that contain matching items
    if (searchValue.trim()) {
      const matchingCategories = getMatchingCategories(searchValue);
      setActiveKeys(matchingCategories);
    } else {
      setActiveKeys([]);
    }
  }

  function getMatchingCategories(searchTerm: string): string[] {
    // Find items that match the search term
    const matchingItems = equipmentData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm),
    );

    // Get categories from matching items
    const categoriesFromItems = matchingItems.map((item) => item.category);

    // Find categories whose names match the search term
    const categoriesFromNames = Object.values(EquipmentCategories).filter(
      (category) =>
        slugToTitleCase(category).toLowerCase().includes(searchTerm),
    );

    // Combine all categories and convert to enum keys
    const allCategories = [...categoriesFromItems, ...categoriesFromNames];
    const enumKeys = [...new Set(allCategories)]
      .map((categoryValue) => {
        const entry = Object.entries(EquipmentCategories).find(
          ([, value]) => value === categoryValue,
        );
        return entry?.[0];
      })
      .filter(Boolean) as string[];

    return enumKeys;
  }

  function getEquipmentCategoryChildren(
    category: string,
    skipSearchFilter = false,
  ) {
    const categoryItems = equipmentData.filter(
      (item) => item.category === category,
    );

    if (skipSearchFilter || !search.trim()) {
      return categoryItems;
    }

    const lowercaseSearch = search.toLowerCase();
    return categoryItems.filter((item) =>
      item.name.toLowerCase().includes(lowercaseSearch),
    );
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
        const filteredItems = getEquipmentCategoryChildren(
          value,
          !search.trim(),
        );

        // Only show categories that have items
        const shouldShowCategory = filteredItems.length > 0;

        if (shouldShowCategory) {
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
                          characterDispatch={characterDispatch}
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
                      characterDispatch={characterDispatch}
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
        placeholder="Search for equipment (e.g., 'cutlass', 'sword', 'armor')"
        value={search}
        onChange={handleSearchChange}
      />
      <Collapse
        items={items}
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
      />
      <Alert
        type="info"
        message={
          <Descriptions
            size="small"
            items={descriptionsItems}
            column={1}
            styles={{ content: { fontSize: ".75rem" } }}
          />
        }
      />
    </Flex>
  );
};

export default EquipmentStore;
