import { Tooltip } from "antd";
import { HelpTooltipProps } from "./definitions";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function HelpTooltip({ text, className }: HelpTooltipProps) {
  return (
    <Tooltip
      className={`${className} print:hidden`}
      title={text}
      color="#3E3643"
    >
      <QuestionCircleOutlined className="text-lg" />
    </Tooltip>
  );
}
