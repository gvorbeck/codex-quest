import { Typography } from "antd";
import { DescriptionBubbleProps } from "./definitions";
import classNames from "classnames";

export default function DescriptionBubble({
  description,
  className,
  title,
}: DescriptionBubbleProps) {
  const descriptionBubbleClassName = classNames(
    className,
    "bg-shipGray text-springWood p-4 rounded shadow-md"
  );
  return (
    <Typography.Paragraph className={descriptionBubbleClassName}>
      <strong>Description:{title}</strong>
      <div
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </Typography.Paragraph>
  );
}
