import { Typography } from "antd";
import React from "react";

interface HomebrewWarningProps {
  homebrew: string;
}

const HomebrewWarning: React.FC<
  HomebrewWarningProps & React.ComponentPropsWithRef<"div">
> = ({ homebrew, className }) => {
  return (
    <Typography.Text
      type="warning"
      italic
      className={`block text-rust ${className}`}
    >
      Work closely with your GM when using a custom {homebrew}.
    </Typography.Text>
  );
};

export default HomebrewWarning;
