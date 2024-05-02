import { Flex, Switch, Typography } from "antd";

interface SupplementalContentSwitchProps {
  supplementalSwitch: boolean;
  setSupplementalSwitch: React.Dispatch<React.SetStateAction<boolean>>;
}

const SupplementalContentSwitch: React.FC<
  SupplementalContentSwitchProps & React.ComponentPropsWithRef<"div">
> = ({ supplementalSwitch, setSupplementalSwitch }) => {
  function handleSupplementalSwitchChange() {
    setSupplementalSwitch((prevSupplementalSwitch) => !prevSupplementalSwitch);
  }
  return (
    <Flex gap={16}>
      <Typography.Text>Enable Supplemental Content</Typography.Text>
      <Switch
        checked={supplementalSwitch}
        onChange={handleSupplementalSwitchChange}
      />
    </Flex>
  );
};

export default SupplementalContentSwitch;
