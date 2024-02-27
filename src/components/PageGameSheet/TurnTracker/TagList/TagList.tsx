import { CombatantType } from "@/data/definitions";
import { Flex, Tag } from "antd";
import React from "react";

interface TagListProps {
  combatant: CombatantType;
  handleClose: (removedTag: string, combatant: string) => void;
}

const TagList: React.FC<TagListProps & React.ComponentPropsWithRef<"div">> = ({
  className,
  combatant,
  handleClose,
}) => {
  return (
    <Flex gap={8} className={className}>
      {combatant.tags.map((tag) => (
        <Tag
          key={tag}
          closable
          onClose={(e) => {
            e.preventDefault();
            handleClose(tag, combatant.name);
          }}
          className="border-stone"
        >
          {tag}
        </Tag>
      ))}
    </Flex>
  );
};

export default TagList;
