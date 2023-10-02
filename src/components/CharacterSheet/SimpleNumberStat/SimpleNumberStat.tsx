import { Statistic, Typography } from "antd";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";

type SimpleNumberStatProps = {
  title: string;
  value: string | number;
  altValue?: string | number;
  helpText?: string;
};

export default function SimpleNumberStat({
  title,
  value,
  helpText,
  altValue,
}: SimpleNumberStatProps) {
  return (
    <Statistic
      className="text-center"
      title={
        <div className="flex items-baseline gap-4 justify-center text-shipGray">
          <Typography.Title level={3} className="mt-0 mb-2 text-shipGray">
            {title}
          </Typography.Title>
          {helpText && helpText.length > 0 && <HelpTooltip text={helpText} />}
        </div>
      }
      value={value}
      valueStyle={{
        fontSize: "3.75rem",
        lineHeight: "1",
        fontWeight: "bold",
        color: "#3E3643",
      }}
      suffix={altValue && <div className="text-base">/ {altValue}</div>}
    />
  );
}
