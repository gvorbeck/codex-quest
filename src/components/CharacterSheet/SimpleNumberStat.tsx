import { Statistic, Typography } from "antd";
import { SimpleNumberStatProps } from "../types";

export default function SimpleNumberStat({
  title,
  value,
}: SimpleNumberStatProps) {
  return (
    <Statistic
      className="text-center"
      title={
        <Typography.Title level={3} className="mt-0 mb-2 text-shipGray">
          {title}
        </Typography.Title>
      }
      value={value}
      valueStyle={{
        fontSize: "3.75rem",
        lineHeight: "1",
        fontWeight: "bold",
        color: "#3E3643",
      }}
    />
  );
}
