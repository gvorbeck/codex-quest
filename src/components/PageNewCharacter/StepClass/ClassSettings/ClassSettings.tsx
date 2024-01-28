import { CharData, RaceNames } from "@/data/definitions";
import { races } from "@/data/races";
import { useDeviceType } from "@/hooks/useDeviceType";
import { Flex, Switch, Typography } from "antd";
import classNames from "classnames";
import React from "react";

interface ClassSettingsProps {
  character: CharData;
  combinationClass: boolean;
  supplementalContent: boolean;
  onCombinationClassChange: (checked: boolean) => void;
  onSupplementalContentChange: (checked: boolean) => void;
}

const ClassSettings: React.FC<
  ClassSettingsProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  onCombinationClassChange,
  onSupplementalContentChange,
  character,
  supplementalContent,
  combinationClass,
}) => {
  const { isMobile } = useDeviceType();
  const flexClassNames = classNames(
    { "flex-col-reverse": isMobile },
    { "mt-4": isMobile },
    className,
  );
  const innerFlexClassNames = classNames({ "justify-between": isMobile });
  return (
    <Flex gap={16} className={flexClassNames}>
      <Flex gap={8} className={innerFlexClassNames}>
        <Typography.Text>Enable Supplemental Content</Typography.Text>
        <Switch
          checked={supplementalContent}
          onChange={onSupplementalContentChange}
        />
      </Flex>
      {races[character.race as RaceNames]?.allowedCombinationClasses && (
        <Flex gap={8} className={innerFlexClassNames}>
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

export default ClassSettings;
