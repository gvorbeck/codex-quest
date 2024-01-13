import classNames from "classnames";
import { Button, Tooltip } from "antd";
import { ReactNode } from "react";

type DescriptionFieldButtonProps = {
  handler: (event: React.MouseEvent<HTMLElement>) => void;
  icon: ReactNode;
};

// Button component for adding and deleting text fields
export default function DescriptionFieldButton({
  handler,
  icon,
  className,
}: DescriptionFieldButtonProps & React.ComponentPropsWithRef<"div">) {
  const buttonClassNames = classNames(className, "mb-4", "shadow-none");
  return (
    <Tooltip title="Add text field">
      <Button
        type="primary"
        shape="circle"
        icon={icon}
        onClick={handler}
        className={buttonClassNames}
      />
    </Tooltip>
  );
}
