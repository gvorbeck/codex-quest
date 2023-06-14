import { Typography } from "antd";
import { SimpleNumberStatProps } from "../types";

export default function SimpleNumberStat({
  title,
  value,
}: SimpleNumberStatProps) {
  // Prevent "Hit Dice" text from wrapping
  let className = value.toString().length > 3 ? "md:text-4xl lg:text-5xl" : "";
  return (
    <div className="text-center">
      <Typography.Title level={3} className="mt-0 mb-2 !text-shipGray">
        {title}
      </Typography.Title>
      <Typography.Text
        className={`${className} text-6xl font-bold text-shipGray`}
      >
        {value}
      </Typography.Text>
    </div>
  );
}
