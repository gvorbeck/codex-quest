import { Typography } from "antd";
import { SimpleNumberStatProps } from "../types";

export default function SimpleNumberStat({
  title,
  value,
}: SimpleNumberStatProps) {
  return (
    <div className="text-center">
      <Typography.Title level={3} className="mt-0 text-shipGray">
        {title}
      </Typography.Title>
      <Typography.Text className="text-6xl font-bold text-shipGray">
        {value}
      </Typography.Text>
    </div>
  );
}
