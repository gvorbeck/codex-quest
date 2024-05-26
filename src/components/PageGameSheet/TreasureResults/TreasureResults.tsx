import { Loot } from "@/data/definitions";
import { getGems, getJewels } from "@/support/diceSupport";
import { Descriptions, DescriptionsProps, Empty, Flex } from "antd";
import React from "react";

interface TreasureResultsProps {
  results: Loot | undefined;
}

const TreasureResults: React.FC<TreasureResultsProps> = ({ results }) => {
  const mainTreasureItems: DescriptionsProps["items"] = [
    { key: "copper", label: "Copper", children: results?.copper || 0 },
    { key: "silver", label: "Silver", children: results?.silver || 0 },
    { key: "electrum", label: "Electrum", children: results?.electrum || 0 },
    { key: "gold", label: "Gold", children: results?.gold || 0 },
    { key: "platinum", label: "Platinum", children: results?.platinum || 0 },
    { key: "gems", label: "Gems", children: results?.gems || 0 },
    { key: "jewels", label: "Jewels", children: results?.jewels || 0 },
    { key: "magicItems", label: "Magic Items", children: results?.magicItems },
  ];

  const gemsData = results ? getGems(results) : undefined;
  const gemsDescriptions = gemsData ? (
    <Flex gap={16} vertical>
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
    </Flex>
  ) : null;

  const jewelsData = results ? getJewels(results) : undefined;
  const jewelssDescriptions = jewelsData ? (
    <Flex gap={16} vertical>
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
    </Flex>
  ) : null;

  return results ? (
    <Flex gap={16} vertical>
      <Descriptions
        bordered
        column={4}
        title="Treasure"
        items={mainTreasureItems}
      />
      {gemsDescriptions}
      {jewelssDescriptions}
    </Flex>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Treasure" />
  );
};

export default TreasureResults;
