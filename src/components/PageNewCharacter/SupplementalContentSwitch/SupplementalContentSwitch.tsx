import { Flex, Switch, Typography } from "antd";

interface SupplementalContentSwitchProps {
  supplementalSwitch: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

const SupplementalContentSwitch: React.FC<
  SupplementalContentSwitchProps & React.ComponentPropsWithRef<"div">
> = ({ supplementalSwitch, onChange, label }) => {
  return (
    <Flex gap={8}>
      <Typography.Text>
        {label ?? "Enable Supplemental Content"}
      </Typography.Text>
      <Switch checked={supplementalSwitch} onChange={onChange} />
    </Flex>
  );
};

export default SupplementalContentSwitch;
