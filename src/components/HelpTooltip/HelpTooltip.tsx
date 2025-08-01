import { Tooltip } from "antd";
import React from "react";
import { clsx } from "clsx";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { ColorScheme } from "@/support/colorSupport";
import LightMarkdown from "@/components/LightMarkdown/LightMarkdown";

interface HelpTooltipProps {
  text: string;
}

const HelpTooltip: React.FC<
  HelpTooltipProps & React.ComponentPropsWithRef<"div">
> = ({ className, text }) => {
  const tooltipClassNames = clsx(className, "print:hidden", "cursor-help");
  return (
    <Tooltip
      className={tooltipClassNames}
      title={
        <div className="[&_p]:mt-0 [&_p:last-child]:mb-0">
          <LightMarkdown>{text}</LightMarkdown>
        </div>
      }
      color={ColorScheme.SHIPGRAY}
    >
      <QuestionCircleOutlined className="text-lg" />
    </Tooltip>
  );
};

export default HelpTooltip;
