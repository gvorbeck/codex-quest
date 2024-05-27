import { Divider } from "antd";
import React from "react";

const CqDivider: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  children,
}) => {
  return (
    <Divider plain className={`font-enchant text-2xl my-4 ${className}`}>
      {children}
    </Divider>
  );
};

export default CqDivider;
