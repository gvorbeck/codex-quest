import { useDeviceType } from "@/hooks/useDeviceType";
import { Flex, Switch, Typography } from "antd";
import React from "react";

interface OptionsProps {
  comboClass?: boolean;
  comboClassSwitch?: boolean;
  setComboClassSwitch: (comboClassSwitch: boolean) => void;
  supplementalContentSwitch: boolean;
  setSupplementalContentSwitch: (supplementalContentSwitch: boolean) => void;
}

const Options: React.FC<OptionsProps & React.ComponentPropsWithRef<"div">> = ({
  className,
  comboClass,
  comboClassSwitch,
  setComboClassSwitch,
  supplementalContentSwitch,
  setSupplementalContentSwitch,
}) => {
  const { isMobile } = useDeviceType();
  return (
    <Flex className={className} gap={isMobile ? 16 : 32} vertical={isMobile}>
      <Flex gap={8}>
        <Typography.Text>Enable Supplemental Content</Typography.Text>
        <Switch
          checked={supplementalContentSwitch}
          onChange={setSupplementalContentSwitch}
        />
      </Flex>
      {comboClass && (
        <Flex gap={8}>
          <Typography.Text>Combination Class</Typography.Text>
          <Switch checked={comboClassSwitch} onChange={setComboClassSwitch} />
        </Flex>
      )}
    </Flex>
  );
};

export default Options;
