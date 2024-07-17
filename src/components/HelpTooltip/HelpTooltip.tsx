import { Tooltip } from "antd";
import React from "react";
import classNames from "classnames";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { ColorScheme } from "@/support/colorSupport";
import Markdown from "react-markdown";

interface HelpTooltipProps {
  text: string;
}

const HelpTooltip: React.FC<
  HelpTooltipProps & React.ComponentPropsWithRef<"div">
> = ({ className, text }) => {
  const tooltipClassNames = classNames(
    className,
    "print:hidden",
    "cursor-help",
  );
  return (
    <Tooltip
      className={tooltipClassNames}
      title={
        <div className="[&_p]:mt-0 [&_p:last-child]:mb-0">
          <Markdown>{text}</Markdown>
        </div>
      }
      color={ColorScheme.SHIPGRAY}
    >
      <QuestionCircleOutlined className="text-lg" />
    </Tooltip>
  );
};

export default HelpTooltip;
