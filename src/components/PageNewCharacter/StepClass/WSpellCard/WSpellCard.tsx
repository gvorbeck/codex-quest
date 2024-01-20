import { Spell } from "@/data/definitions";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useImages } from "@/hooks/useImages";
import { useMarkdown } from "@/hooks/useMarkdown";
import { toSlugCase } from "@/support/stringSupport";
import { Card, Descriptions, Flex, Image } from "antd";
import classNames from "classnames";
import React from "react";

interface WSpellCardProps {
  startingSpells: Spell[];
}

const WSpellCard: React.FC<
  WSpellCardProps & React.ComponentPropsWithRef<"div">
> = ({ className, startingSpells }) => {
  const cardClassNames = classNames("shadow-md", className);
  const { isMobile } = useDeviceType();
  const { getSpellImage } = useImages();
  const spellImage = getSpellImage(toSlugCase(startingSpells?.[1]?.name || ""));
  const spellDescriptionMarkdown = useMarkdown(
    startingSpells?.[1]?.description ?? "",
  );
  return (
    <Card
      title={
        <span className="font-enchant text-3xl tracking-wide">
          {startingSpells[1]?.name}
        </span>
      }
      className={cardClassNames}
    >
      <Flex gap={16} align="flex-start" vertical={isMobile}>
        <Image src={spellImage} className="w-40" preview={false} />
        <div>
          <Descriptions
            items={[
              {
                key: "1",
                label: "Range",
                children: startingSpells[1]?.range,
              },
              {
                key: "2",
                label: "Duration",
                children: startingSpells[1]?.duration,
              },
            ]}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: spellDescriptionMarkdown,
            }}
            className="text-justify"
          />
        </div>
      </Flex>
    </Card>
  );
};

export default WSpellCard;
