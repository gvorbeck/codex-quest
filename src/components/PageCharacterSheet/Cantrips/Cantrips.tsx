import { CharacterDataContext } from "@/store/CharacterContext";
import { Collapse, CollapseProps, Empty, Popconfirm } from "antd";
import React from "react";
import CantripDescriptions from "./CantripDescriptions/CantripDescriptions";
import { CloseOutlined } from "@ant-design/icons";
import cantrips from "@/data/cantrips.json";
import { ZeroLevelSpell } from "@/data/definitions";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CantripsProps {}

const Cantrips: React.FC<
  CantripsProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const { character, characterDispatch } =
    React.useContext(CharacterDataContext);

  const deleteCustomCantrip = (cantrip: ZeroLevelSpell) => {
    const cantrips = character?.cantrips?.filter(
      (c) => c.name !== cantrip.name,
    );
    characterDispatch({
      type: "UPDATE",
      payload: { cantrips },
    });
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
