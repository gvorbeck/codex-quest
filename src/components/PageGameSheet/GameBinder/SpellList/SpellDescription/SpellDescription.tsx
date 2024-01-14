import React from "react";
import { Spell } from "@/data/definitions";
import { Descriptions, DescriptionsProps } from "antd";
import { toTitleCase } from "@/support/stringSupport";
import { useMarkdown } from "@/hooks/useMarkdown";

interface SpellDescriptionProps {
  spell: Spell;
}

const SpellDescription: React.FC<
  SpellDescriptionProps & React.ComponentPropsWithRef<"div">
> = ({ className, spell }) => {
  const items: DescriptionsProps["items"] = [
    {
      key: "range",
      label: "Range",
      children: spell.range,
    },
    {
      key: "level",
      label: "Level",
      children: Object.entries(spell.level)
        .map(([key, value]) => !!value && `${toTitleCase(key)}: ${value}`)
        .filter(Boolean)
        .join(", "),
    },
    {
      key: "duration",
      label: "Duration",
      children: spell.duration,
    },
    {
      key: "description",
      children: (
        <div
          dangerouslySetInnerHTML={{ __html: useMarkdown(spell.description) }}
        />
      ),
    },
  ];
  return (
    <Descriptions
      className={className}
      items={items}
      column={1}
      contentStyle={{ textAlign: "justify" }}
    />
  );
};

export default SpellDescription;
