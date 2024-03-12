import { CharacterDataContext } from "@/contexts/CharacterContext";
import { Collapse, CollapseProps, Flex } from "antd";
import React from "react";
import SpellDescriptions from "./SpellDescriptions/SpellDescriptions";

interface SpellsProps {}

const Spells: React.FC<SpellsProps & React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const { character, setCharacter } = React.useContext(CharacterDataContext);
  const items: CollapseProps["items"] = character?.spells
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((spell) => ({
      key: spell.name,
      label: spell.name,
      children: (
        <SpellDescriptions
          spell={spell}
          character={character}
          setCharacter={setCharacter}
        />
      ),
    }));
  return (
    <Flex vertical gap={16}>
      <Collapse items={items} className={className} />
    </Flex>
  );
};

export default Spells;
