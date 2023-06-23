import { Tooltip } from "antd";
import { HelpTooltipProps } from "./definitions";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function HelpTooltip({ text, className }: HelpTooltipProps) {
  return (
    <Tooltip className={className} title={text}>
      <QuestionCircleOutlined className="text-lg" />
    </Tooltip>
  );
}
