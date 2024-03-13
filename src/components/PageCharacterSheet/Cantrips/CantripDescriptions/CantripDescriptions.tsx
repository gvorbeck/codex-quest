import { ZeroLevelSpell } from "@/data/definitions";
import { useMarkdown } from "@/hooks/useMarkdown";
import { Descriptions, DescriptionsProps, Typography } from "antd";
import React from "react";

interface CantripDescriptionsProps {
  cantrip: ZeroLevelSpell;
}

const CantripDescriptions: React.FC<
  CantripDescriptionsProps & React.ComponentPropsWithRef<"div">
> = ({ className, cantrip }) => {
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Description",
      children: cantrip.description,
    },
  ];
  return (
    <>
      <Descriptions items={items} className={className} layout="vertical" />
      {/* <div>
        {spellImage && (
          <div className="w-28 float-left mr-4 mb-2">
            <Image src={spellImage} preview={false} />
          </div>
        )}
      </div> */}
    </>
  );
};

export default CantripDescriptions;
