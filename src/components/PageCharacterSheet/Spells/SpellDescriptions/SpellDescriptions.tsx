import { CharData, Spell } from "@/data/definitions";
import { useImages } from "@/hooks/useImages";
import { useMarkdown } from "@/hooks/useMarkdown";
import { useSpellData } from "@/hooks/useSpellData";
import { toSlugCase } from "@/support/stringSupport";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Image,
  Popconfirm,
  Typography,
  message,
} from "antd";
import React from "react";

interface SpellDescriptionsProps {
  spell: Spell;
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const SpellDescriptions: React.FC<
  SpellDescriptionsProps & React.ComponentPropsWithRef<"div">
> = ({ className, spell, character, setCharacter }) => {
  const { getSpellImage } = useImages();
  const { isCustomSpell } = useSpellData();
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Range",
      children: spell.range,
    },
    {
      key: "2",
      label: "Duration",
      children: spell.duration,
    },
  ];
  const spellImage = getSpellImage(toSlugCase(spell.name || ""));
  const confirm = (
    item: Spell,
    character: CharData,
    setCharacter: (character: CharData) => void,
  ) => {
    message.success(`${item.name} deleted`);
    setCharacter({
      ...character,
      spells: character.spells.filter((e) => e.name !== item.name),
    });
  };

  const cancel = () => {};
  return (
    <>
      <Descriptions items={items} className={className} />
      <div>
        {spellImage && (
          <div className="w-28 float-left mr-4 mb-2">
            <Image src={spellImage} preview={false} />
          </div>
        )}
        <Typography
          dangerouslySetInnerHTML={{ __html: useMarkdown(spell.description) }}
          className="text-justify"
        />
      </div>
      {isCustomSpell(spell.name) && (
        <Popconfirm
          title="Delete equipment item"
          description="Are you sure to delete this item?"
          onConfirm={() => confirm(spell, character, setCharacter)}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<DeleteOutlined />}>Delete</Button>
        </Popconfirm>
      )}
    </>
  );
};

export default SpellDescriptions;
