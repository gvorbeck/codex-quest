import { Tooltip } from "antd";
import { HelpTooltipProps } from "./definitions";
import { QuestionCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { marked } from "marked";

export default function HelpTooltip({ text, className }: HelpTooltipProps) {
  const tooltipClassNames = classNames(
    className,
    "print:hidden",
    "cursor-help"
  );
  return (
    <Tooltip
      className={tooltipClassNames}
      title={<div dangerouslySetInnerHTML={{ __html: marked(text) }} />}
      color="#3E3643"
    >
      <QuestionCircleOutlined className="text-lg" />
    </Tooltip>
  );
}
