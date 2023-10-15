import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { marked } from "marked";

export default function HelpTooltip({
  text,
  className,
}: { text: string } & React.ComponentPropsWithRef<"div">) {
  const tooltipClassNames = classNames(
    className,
    "print:hidden",
    "cursor-help"
  );
  return (
    <Tooltip
      className={tooltipClassNames}
      title={
        <div
          className="[&_p]:mt-0 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: marked(text) }}
        />
      }
      color="#3E3643"
    >
      <QuestionCircleOutlined className="text-lg" />
    </Tooltip>
  );
}
