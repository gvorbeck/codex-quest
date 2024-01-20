import { CharData, RaceNames } from "@/data/definitions";
import { races } from "@/data/races";
import { Flex, Switch, Typography } from "antd";
import React from "react";

interface WClassSettingsProps {
  character: CharData;
  combinationClass: boolean;
  supplementalContent: boolean;
  onCombinationClassChange: (checked: boolean) => void;
  onSupplementalContentChange: (checked: boolean) => void;
}

const WClassSettings: React.FC<
  WClassSettingsProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  onCombinationClassChange,
  onSupplementalContentChange,
  character,
  supplementalContent,
  combinationClass,
}) => {
  return (
    <Flex gap={16} className={className}>
      <Flex gap={8}>
        <Typography.Text>Enable Supplemental Content</Typography.Text>
        <Switch
          checked={supplementalContent}
          onChange={onSupplementalContentChange}
        />
      </Flex>
      {races[character.race as RaceNames]?.allowedCombinationClasses && (
        <Flex gap={8}>
          <Typography.Text>Use Combination Class</Typography.Text>
          <Switch
            checked={combinationClass}
            onChange={onCombinationClassChange}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default WClassSettings;
