import { Button, Flex, Tooltip, Typography } from "antd";
import React from "react";
import HelpTooltip from "@/components/HelpTooltip/HelpTooltip";
import { EditOutlined } from "@ant-design/icons";

interface SectionProps {
  title?: string;
  showEditButton?: boolean;
  titleHelpText?: string;
  editComponent?: React.ReactNode;
  editComponentClassName?: string;
  onEditClick?: () => void;
}

const Section: React.FC<SectionProps & React.ComponentPropsWithRef<"div">> = ({
  className,
  title,
  showEditButton,
  editComponent,
  editComponentClassName,
  titleHelpText,
  children,
  onEditClick,
}) => {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  function handleEditClick() {
    if (editComponent) {
      setIsEditing((prevEditing) => !prevEditing);
    } else if (onEditClick) {
      onEditClick();
    }
  }

  // const editing = isEditing ? editableComponent : component;

  return (
    <Flex vertical className={className}>
      <Flex gap={16} align="baseline">
        {!!title && (
          <Typography.Title level={3} className="mt-0 leading-none">
            {title}
          </Typography.Title>
        )}
        {!!showEditButton && (
          <Tooltip title={isEditing ? "Save" : "Edit"}>
            <Button
              type={isEditing ? "primary" : "link"}
              icon={<EditOutlined className="cursor" />}
              onClick={handleEditClick}
              className={"shadow-none " + editComponentClassName}
            />
          </Tooltip>
        )}
        {!!titleHelpText && <HelpTooltip text={titleHelpText} />}
      </Flex>
      <div>{!!isEditing ? editComponent : children}</div>
    </Flex>
  );
};

export default Section;
