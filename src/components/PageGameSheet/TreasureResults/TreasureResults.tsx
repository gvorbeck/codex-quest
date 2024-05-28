import CqDivider from "@/components/CqDivider/CqDivider";
import {
  Loot,
  MagicArmorTreasure,
  MiscItemTreasure,
  WeaponTreasure,
} from "@/data/definitions";
import { useDeviceType } from "@/hooks/useDeviceType";
import { getGems, getJewels } from "@/support/diceSupport";
import { Descriptions, DescriptionsProps, Empty, Flex } from "antd";
import React from "react";

interface TreasureResultsProps {
  results: Loot | undefined;
}

interface TreasureSectionProps {
  title: string;
}

const TreasureSection: React.FC<
  TreasureSectionProps & React.ComponentPropsWithRef<"div">
> = ({ children, title }) => {
  const { isMobile } = useDeviceType();
  return (
    <>
      <CqDivider>{title}</CqDivider>
      <Flex gap={32} vertical={isMobile} wrap>
        {children}
      </Flex>
    </>
  );
};

const TreasureResults: React.FC<TreasureResultsProps> = ({ results }) => {
  const mainTreasureItems: DescriptionsProps["items"] = [
    { key: "copper", label: "Copper", children: results?.copper || 0 },
    { key: "silver", label: "Silver", children: results?.silver || 0 },
    { key: "electrum", label: "Electrum", children: results?.electrum || 0 },
    { key: "gold", label: "Gold", children: results?.gold || 0 },
    { key: "platinum", label: "Platinum", children: results?.platinum || 0 },
    { key: "gems", label: "Gems", children: results?.gems || 0 },
    { key: "jewels", label: "Jewels", children: results?.jewels || 0 },
    {
      key: "magicItems",
      label: "Magic Items",
      children: results?.magicItems.length,
    },
  ];

  const gemsData = results ? getGems(results) : undefined;
  const gemsDescriptions = gemsData ? (
    <>
      <TreasureSection title="Gems">
        {gemsData?.map((gem) => {
          const gemItems: DescriptionsProps["items"] = [
            { key: "amount", label: "Amount", children: gem.amount },
            { key: "quality", label: "Quality", children: gem.quality },
            { key: "value", label: "Value", children: gem.value },
          ];
          return (
            <Descriptions
              bordered
              column={3}
              title={"Gem: " + gem.type}
              items={gemItems}
              size="small"
              key={gem.type + gem.quality + gem.amount + gem.value}
            />
          );
        })}
      </TreasureSection>
    </>
  ) : null;

  const jewelsData = results ? getJewels(results) : undefined;
  const jewelsDescriptions = jewelsData ? (
    <TreasureSection title="Jewels">
      {jewelsData?.map((jewel) => {
        const jewelItems: DescriptionsProps["items"] = [
          { key: "value", label: "Value", children: jewel.value },
        ];
        return (
          <Descriptions
            bordered
            column={1}
            title={"Jewel: " + jewel.type}
            items={jewelItems}
            size="small"
            key={jewel.type + jewel.value}
          />
        );
      })}
    </TreasureSection>
  ) : null;

  const magicWeaponItems = (item: WeaponTreasure) => [
    { key: "name", label: "Name", children: item.name },
    { key: "bonus", label: "Bonus", children: item.bonus },
    {
      key: "specAbility",
      label: "Special Ability",
      children: item.specAbility,
    },
  ];
  const magicArmorItems = (item: MagicArmorTreasure) => [
    { key: "name", label: "Name", children: item.name },
    { key: "bonus", label: "Bonus", children: item.bonus },
    {
      key: "special",
      label: "Special",
      children: item.special,
    },
  ];
  const magicMiscItems = (item: MiscItemTreasure) => [
    { key: "form", label: "Form", children: item.form },
    { key: "effect", label: "Effect", children: item.effect },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function magicItemContent(item: any) {
    if (typeof item === "string") return <span>{item}</span>;
    let items: DescriptionsProps["items"];
    if (item.id === "weapon") items = magicWeaponItems(item);
    if (item.id === "armor") items = magicArmorItems(item);
    if (item.id === "misc") items = magicMiscItems(item);
    return (
      <Descriptions
        bordered
        column={1}
        items={items}
        size="small"
        key={item.id}
      />
    );
  }

  const magicItemsDescriptions = results?.magicItems?.length ? (
    <TreasureSection title="Magic Items">
      {results?.magicItems.map((item) => magicItemContent(item))}
    </TreasureSection>
  ) : null;
  console.log(results?.magicItems);

  return results ? (
    <Flex gap={16} vertical>
      <CqDivider>Treasure</CqDivider>
      <Descriptions bordered column={4} items={mainTreasureItems} />
      {!!results?.gems && gemsDescriptions}
      {!!results?.jewels && jewelsDescriptions}
      {!!results.magicItems && magicItemsDescriptions}
    </Flex>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Treasure" />
  );
};

export default TreasureResults;
