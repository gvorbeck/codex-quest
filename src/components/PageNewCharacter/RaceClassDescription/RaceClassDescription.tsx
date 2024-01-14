import { Card, Flex, Image } from "antd";
import React from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import classNames from "classnames";
import { useImages } from "@/hooks/useImages";
import { useMarkdown } from "@/hooks/useMarkdown";

interface RaceClassDescriptionProps {
  name: string;
  description: string;
}

const RaceClassDescription: React.FC<
  RaceClassDescriptionProps & React.ComponentPropsWithRef<"div">
> = ({ className, name, description }) => {
  const { getRaceClassImage } = useImages();
  const raceClassImage = getRaceClassImage(name);
  const { isMobile } = useDeviceType();
  const descriptionClassNames = classNames({ "flex-col-reverse": isMobile });
  return (
    <Card
      className={className}
      title={
        <span className="font-enchant text-3xl tracking-wide">{name}</span>
      }
    >
      <Flex
        gap={16}
        align="flex-start"
        vertical={isMobile}
        className={descriptionClassNames}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: useMarkdown(description),
          }}
        />
        <Image src={raceClassImage} className="w-64" />
      </Flex>
    </Card>
  );
};

export default RaceClassDescription;
