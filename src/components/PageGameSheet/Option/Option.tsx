import { useDeviceType } from "@/hooks/useDeviceType";
import { Radio } from "antd";

interface OptionProps {
  button?: boolean;
  value: number | string;
  title: string;
}

const Option: React.FC<OptionProps> = ({ value, title }) => {
  const { isMobile } = useDeviceType();
  if (!isMobile) {
    return <Radio.Button value={value}>{title}</Radio.Button>;
  }
  return (
    <Radio value={value} className="block">
      {title}
    </Radio>
  );
};

export default Option;
