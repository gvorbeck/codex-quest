import React from "react";
import { RaceNames } from "@/data/definitions";
import { Descriptions, DescriptionsProps, Flex } from "antd";
import CharacterStat from "../CharacterStat/CharacterStat";
import { getCarryingCapacity, getWeight } from "@/support/statSupport";
import { CharacterDataContext } from "@/store/CharacterContext";
import { useDeviceType } from "@/hooks/useDeviceType";

const Weight: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const { isMobile } = useDeviceType();
  const { character } = React.useContext(CharacterDataContext);
  const capacity = getCarryingCapacity(
    +character.abilities.scores.strength,
    character.race as RaceNames,
  );
  const weight = getWeight(character);
  const items: DescriptionsProps["items"] = [
    { key: "1", label: "Max Weight", children: capacity.heavy },
    {
      key: "2",
      label: "Load",
      children: weight < capacity.light ? "Lightly Loaded" : "Heavily Loaded",
    },
  ];

  return (
    <Flex gap={16} className={className} vertical={!isMobile}>
      <CharacterStat value={weight.toFixed(0)} />
      <Descriptions bordered column={1} size="small" items={items} />
    </Flex>
  );
};

export default Weight;
