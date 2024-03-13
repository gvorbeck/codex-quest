import { CharacterDataContext } from "@/contexts/CharacterContext";
import { Collapse, CollapseProps } from "antd";
import React from "react";
import CantripDescriptions from "./CantripDescriptions/CantripDescriptions";

interface CantripsProps {}

const Cantrips: React.FC<
  CantripsProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const { character, setCharacter } = React.useContext(CharacterDataContext);
  const items: CollapseProps["items"] = character?.cantrips
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((spell) => ({
      key: spell.name,
      label: spell.name,
      children: <CantripDescriptions />,
    }));
  return <Collapse items={items} className={className} />;
};

export default Cantrips;
