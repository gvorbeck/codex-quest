import { CharacterDataContext } from "@/contexts/CharacterContext";
import { Collapse, CollapseProps, Popconfirm } from "antd";
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
    setCharacter({ ...character, cantrips: newCantrips });
  };

  const items: CollapseProps["items"] = character?.cantrips
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((spell) => {
      // Determine if `spell` is a custom cantrip.
      const customCantrip = !cantrips.find((c) => c.name === spell.name);
      return {
        key: spell.name,
        label: spell.name,
        children: <CantripDescriptions />,
        extra: customCantrip ? (
          <Popconfirm
            title="Delete 0 level spell?"
            description="Are you sure to delete this?"
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
  return <Collapse items={items} className={className} />;
};

export default Cantrips;
