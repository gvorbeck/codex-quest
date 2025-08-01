import { CharacterDataContext } from "@/store/CharacterContext";
import { Collapse, CollapseProps, Empty, Popconfirm } from "antd";
import React from "react";
import SpellDescriptions from "./SpellDescriptions/SpellDescriptions";
import { Spell } from "@/data/definitions";
import { useSpellData } from "@/hooks/useSpellData";
import { CloseOutlined } from "@ant-design/icons";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SpellsProps {}

const Spells: React.FC<SpellsProps & React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const { isCustomSpell } = useSpellData();
  const { character, characterDispatch } =
    React.useContext(CharacterDataContext);

  const deleteCustomSpell = (spell: Spell) => {
    const spells = character?.spells?.filter((c) => c.name !== spell.name);
    characterDispatch({
      type: "UPDATE",
      payload: {
        spells,
      },
    });
  };

  const items: CollapseProps["items"] = character?.spells
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((spell) => {
      return {
        key: spell.name,
        label: spell.name,
        children: <SpellDescriptions spell={spell} />,
        extra: isCustomSpell(spell.name) ? (
          <Popconfirm
            title="Delete custom spell?"
            description="Are you sure?"
            onConfirm={(e) => {
              e?.stopPropagation();
              deleteCustomSpell(spell);
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
  return items.length ? (
    <Collapse items={items} className={className} />
  ) : (
    <Empty description="No Spells" />
  );
};

export default Spells;
