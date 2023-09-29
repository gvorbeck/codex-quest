import classNames from "classnames";
import { DescriptionFieldButtonProps } from "./definitions";
import { Button, Tooltip } from "antd";

// Button component for adding and deleting text fields
export default function DescriptionFieldButton({
  handler,
  icon,
  className,
}: DescriptionFieldButtonProps & React.ComponentPropsWithRef<"div">) {
  const buttonClassNames = classNames(className, "mb-4");
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
