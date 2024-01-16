import { classes } from "@/data/classes";
import { ClassNames, RaceNames } from "@/data/definitions";
import { races } from "@/data/races";
import { useMarkdown } from "@/hooks/useMarkdown";
import { Card, Flex, Image } from "antd";
import React from "react";

interface WRaceClassDescriptionProps {
  subject: string;
  image?: string;
}

const WRaceClassDescription: React.FC<
  WRaceClassDescriptionProps & React.ComponentPropsWithRef<"div">
> = ({ className, subject, image }) => {
  const raceDescription = useMarkdown(
    races[subject as RaceNames]?.details?.description ?? "",
  );
  const classDescription = useMarkdown(
    classes[subject as ClassNames]?.details?.description ?? "",
  );
  const cardDescription = raceDescription || classDescription;
  return (
    <Card
      title={
        <span className="font-enchant text-3xl tracking-wide">{subject}</span>
      }
      className={className}
    >
      <Flex gap={16}>
        <div
          dangerouslySetInnerHTML={{
            __html: cardDescription,
          }}
          className="text-justify"
        />
        {image && <Image src={image} className="w-64" preview={false} />}
      </Flex>
    </Card>
  );
};

export default WRaceClassDescription;
