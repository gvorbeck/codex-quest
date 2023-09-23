import classNames from "classnames";
import { DescriptionFieldButtonProps } from "./definitions";
import { Button, Tooltip } from "antd";

// Button component for adding and deleting text fields
export default function DescriptionFieldButton({
  handler,
  icon,
  className,
}: DescriptionFieldButtonProps & React.ComponentPropsWithRef<"div">) {
  const buttonClassNames = classNames("absolute", "left-0", className);
  return (
    <Tooltip title="Add text field" className={buttonClassNames}>
      <Button type="primary" shape="circle" icon={icon} onClick={handler} />
    </Tooltip>
  );
}
