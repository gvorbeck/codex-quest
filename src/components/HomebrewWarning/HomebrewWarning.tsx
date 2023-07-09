import { Typography } from "antd";
import { HomebrewWarningProps } from "./definitions";

export default function HomebrewWarning({
  homebrew,
  className,
}: HomebrewWarningProps) {
  return (
    <Typography.Text
      type="warning"
      italic
      className={`${className} bg-shipGray p-2 rounded border border-seaBuckthorn border-solid inline-block`}
    >
      Work closely with your GM when creating a custom {homebrew}.
    </Typography.Text>
  );
}
