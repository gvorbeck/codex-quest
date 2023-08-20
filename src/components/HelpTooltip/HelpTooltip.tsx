import { Tooltip } from "antd";
import { HelpTooltipProps } from "./definitions";
import { QuestionCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";

export default function HelpTooltip({ text, className }: HelpTooltipProps) {
  const tooltipClassNames = classNames(
    className,
    "print:hidden",
    "cursor-help"
  );
  return (
    <Tooltip className={tooltipClassNames} title={text} color="#3E3643">
      <QuestionCircleOutlined className="text-lg" />
    </Tooltip>
  );
}
