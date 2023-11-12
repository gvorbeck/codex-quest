import { Typography } from "antd";

export default function HomebrewWarning({
  homebrew,
  className,
}: { homebrew: string } & React.ComponentPropsWithRef<"div">) {
  return (
    <Typography.Text
      type="warning"
      italic
      className={`inline-block text-copperRust ${className}`}
    >
      Work closely with your GM when using a custom {homebrew}.
    </Typography.Text>
  );
}
