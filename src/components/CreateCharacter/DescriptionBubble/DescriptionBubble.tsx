import { Typography } from "antd";
import { DescriptionBubbleProps } from "./definitions";

export default function DescriptionBubble({
  description,
}: DescriptionBubbleProps) {
  return (
    <Typography.Paragraph className="bg-shipGray text-springWood p-4 rounded shadow-md">
      <strong>Description:</strong>
      <div
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </Typography.Paragraph>
  );
}
