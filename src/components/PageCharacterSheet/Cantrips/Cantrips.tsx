import { CharacterDataContext } from "@/store/CharacterContext";
import { Collapse, CollapseProps, Empty, Popconfirm } from "antd";
import React from "react";
import CantripDescriptions from "./CantripDescriptions/CantripDescriptions";
import { CloseOutlined } from "@ant-design/icons";
import cantrips from "@/data/cantrips.json";
import { ZeroLevelSpell } from "@/data/definitions";

interface CantripsProps {}

const Cantrips: React.FC<
  CantripsProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const { character, setCharacter } = React.useContext(CharacterDataContext);

  const deleteCustomCantrip = (cantrip: ZeroLevelSpell) => {
    const newCantrips = character?.cantrips?.filter(
      (c) => c.name !== cantrip.name,
    );
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      cantrips: newCantrips,
    }));
  };

  const items: CollapseProps["items"] = character?.cantrips
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((spell) => {
      // Determine if `spell` is a custom cantrip.
      const customCantrip = !cantrips.find((c) => c.name === spell.name);
      return {
        key: spell.name,
        label: spell.name,
        children: <CantripDescriptions cantrip={spell} />,
        extra: customCantrip ? (
          <Popconfirm
            title="Delete custom 0 level spell?"
            description="Are you sure?"
            onConfirm={(e) => {
              e?.stopPropagation();
              deleteCustomCantrip(spell);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Yes"
            cancelText="No"
          >
            <CloseOutlined onClick={(e) => e.stopPropagation()} />
          </Popconfirm>
        ) : undefined,
      };
    });
  return items?.length ? (
    <Collapse items={items} className={className} />
  ) : (
    <Empty description="No 0 Level Spells" />
  );
};

export default Cantrips;
