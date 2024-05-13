import { CharData, Spell } from "@/data/definitions";
import { useMarkdown } from "@/hooks/useMarkdown";
import { Descriptions, DescriptionsProps, Typography } from "antd";
import React from "react";

interface SpellDescriptionsProps {
  spell: Spell;
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const SpellDescriptions: React.FC<
  SpellDescriptionsProps & React.ComponentPropsWithRef<"div">
> = ({ className, spell }) => {
  // const { getSpellImage } = useImages();
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
  // const spellImage = getSpellImage(toSlugCase(spell.name || ""));
  return (
    <>
      <Descriptions items={items} className={className} />
      <div>
        {/* {spellImage && (
          <div className="w-28 float-left mr-4 mb-2">
            <Image src={spellImage} preview={false} />
          </div>
        )} */}
        <Typography
          dangerouslySetInnerHTML={{ __html: useMarkdown(spell.description) }}
          className="text-justify"
        />
      </div>
    </>
  );
};

export default SpellDescriptions;
