import { Spell } from "@/data/definitions";
import { Descriptions, DescriptionsProps, Typography } from "antd";
import React from "react";
import Markdown from "react-markdown";

interface SpellDescriptionsProps {
  spell: Spell;
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
        <Typography className="text-justify">
          <Markdown>{spell.description}</Markdown>
        </Typography>
      </div>
    </>
  );
};

export default SpellDescriptions;
