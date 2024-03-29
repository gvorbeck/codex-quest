import { Tooltip } from "antd";
import React from "react";
import classNames from "classnames";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { ColorScheme } from "@/support/colorSupport";
import { useMarkdown } from "@/hooks/useMarkdown";

interface HelpTooltipProps {
  text: string;
}

const HelpTooltip: React.FC<
  HelpTooltipProps & React.ComponentPropsWithRef<"div">
> = ({ className, text }) => {
  const parsedHtml = useMarkdown(text);
  const tooltipClassNames = classNames(
    className,
    "print:hidden",
    "cursor-help",
  );
  return (
    <Tooltip
      className={tooltipClassNames}
      title={
        <div
          className="[&_p]:mt-0 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: parsedHtml }}
        />
      }
      color={ColorScheme.SHIPGRAY}
    >
      <QuestionCircleOutlined className="text-lg [&_svg]:fill-shipGray" />
    </Tooltip>
  );
};

export default HelpTooltip;
