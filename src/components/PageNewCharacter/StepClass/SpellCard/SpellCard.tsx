import { Spell } from "@/data/definitions";
import { useDeviceType } from "@/hooks/useDeviceType";
import { toSlugCase } from "@/support/stringSupport";
import { Card, Descriptions, Flex, Image } from "antd";
import Markdown from "react-markdown";

interface SpellCardProps {
  spell: Spell;
}

const SpellCard: React.FC<
  SpellCardProps & React.ComponentPropsWithRef<"div">
> = ({ className, spell }) => {
  const { isMobile } = useDeviceType();
  return (
    <Card
      title={<span className="enchant-title">{spell.name}</span>}
      className={"shadow-md " + className}
    >
      <Flex gap={8} align="flex-start" vertical={isMobile}>
        <Image
          src={`/spells/${toSlugCase(spell.name)}.webp`}
          className="w-40"
          preview={false}
        />
        <div>
          <Descriptions
            items={[
              { key: "1", label: "Range", children: spell.range },
              { key: "2", label: "Duration", children: spell.duration },
            ]}
          />
          <div className="text-justify">
            <Markdown>{spell.description}</Markdown>
          </div>
        </div>
      </Flex>
    </Card>
  );
};

export default SpellCard;
