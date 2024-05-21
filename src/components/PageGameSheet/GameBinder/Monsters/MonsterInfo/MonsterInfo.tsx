import { Monster } from "@/data/definitions";
import React from "react";
import MonsterStats from "../MonsterStats/MonsterStats";
import { Flex, Tabs } from "antd";
import Markdown from "react-markdown";

interface MonsterDescriptionProps {
  monster: Monster;
}

const MonsterInfo: React.FC<
  MonsterDescriptionProps & React.ComponentPropsWithRef<"div">
> = ({ className, monster }) => {
  const { variants } = monster;
  let stats = null;
  if (variants) {
    if (variants.length === 1) {
      stats = <MonsterStats stats={variants[0][1]} />;
    } else {
      const items = variants.map((variant) => ({
        key: variant[0],
        label: variant[0],
        children: <MonsterStats stats={variant[1]} />,
      }));
      stats = <Tabs defaultActiveKey="1" items={items} />;
    }
  }
  return (
    <Flex vertical className={className}>
      {stats}
      <Markdown>{monster.description}</Markdown>
    </Flex>
  );
};

export default MonsterInfo;
