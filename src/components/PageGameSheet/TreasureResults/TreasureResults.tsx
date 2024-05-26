import { Loot } from "@/data/definitions";
import { Descriptions, DescriptionsProps, Empty, Flex } from "antd";
import React from "react";

interface TreasureResultsProps {
  results: Loot | undefined;
}

const TreasureResults: React.FC<TreasureResultsProps> = ({ results }) => {
  const mainTreasureItems: DescriptionsProps["items"] = [
    { key: "copper", label: "Copper", children: results?.copper || 0 },
  ];
  return results ? (
    <Flex gap={16} vertical>
      <Descriptions bordered column={1} />
    </Flex>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Treasure" />
  );
};

export default TreasureResults;
