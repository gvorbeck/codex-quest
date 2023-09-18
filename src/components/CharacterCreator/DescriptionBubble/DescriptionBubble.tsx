import { Card, Switch, Typography } from "antd";
import { DescriptionBubbleProps } from "./definitions";
import classNames from "classnames";
import { marked } from "marked";
import { classes } from "../../../data/classes";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";

export default function DescriptionBubble({
  description,
  className,
  title,
}: DescriptionBubbleProps) {
  const descriptionBubbleClassNames = classNames(
    className,
    "bg-shipGray",
    "text-springWood",
    "rounded",
    "shadow-md",
    "[&>div:first-child]:text-springWood",
    "[&>div:first-child]:font-enchant",
    "[&>div:first-child]:text-4xl/[5rem]",
    "[&>div:first-child]:tracking-wider"
  );

  const customRuleToggleClassNames = classNames(
    "bg-springWood",
    "mb-3.5",
    "p-4",
    "rounded",
    "text-shipGray",
    "inline-block"
  );

  const showCustomRuleToggle = Boolean(
    classes[title as keyof typeof classes]?.customRules
  );
  const customRules = classes[title as keyof typeof classes]?.customRules || [];
  return (
    <Card title={title} className={descriptionBubbleClassNames}>
      {/* TEMPLATE FOR FIGHTER CUSTOM RULE */}
      {/* {showCustomRuleToggle &&
        customRules.map((rule) => (
          <div className={customRuleToggleClassNames}>
            <Typography.Text className="text-shipGray mr-4">
              {rule.title}
            </Typography.Text>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
            <Typography.Paragraph className="text-shipGray mb-0 mt-2 italic">
              Consult your GM before enabling this option.
            </Typography.Paragraph>
          </div>
        ))} */}
      <div
        className="[&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
        dangerouslySetInnerHTML={{
          __html: marked(description),
        }}
      />
    </Card>
  );
}
