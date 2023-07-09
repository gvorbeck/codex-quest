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
      // className={`${className} bg-copperRust p-2 rounded border border-seaBuckthorn border-solid inline-block`}
      className={`inline-block text-copperRust ${className}`}
    >
      Work closely with your GM when using a custom {homebrew}.
    </Typography.Text>
  );
}
