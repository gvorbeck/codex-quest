import { Button, Flex, Tooltip, Typography } from "antd";
import React from "react";
import HelpTooltip from "@/components/HelpTooltip/HelpTooltip";
import { EditOutlined } from "@ant-design/icons";
import classNames from "classnames";

interface SectionProps {
  component: React.ReactNode;
  title?: string;
  titleHelpText?: string;
  editableComponent?: React.ReactNode;
  editableClassName?: string;
  editable?: boolean;
}

const Section: React.FC<SectionProps & React.ComponentPropsWithRef<"div">> = ({
  className,
  component,
  title,
  titleHelpText,
  editable,
  editableComponent,
  editableClassName,
}) => {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const editOutlinedClassNames = classNames("shadow-none", editableClassName);

  const handleEditClick = () => {
    const editing = !isEditing;
    setIsEditing(editing);
  };

  return (
    <Flex vertical className={classNames(className)}>
      <Flex gap={16} align="baseline">
        {title && (
          <Typography.Title level={3} className="mt-0 leading-none">
            {title}
          </Typography.Title>
        )}
        {editable && (
          <Tooltip title={isEditing ? "Save" : "Edit"}>
            <Button
              type={isEditing ? "primary" : "link"}
              icon={<EditOutlined className="cursor" />}
              onClick={handleEditClick}
              className={editOutlinedClassNames}
            />
          </Tooltip>
        )}
        {!!titleHelpText && <HelpTooltip text={titleHelpText} />}
      </Flex>
      {isEditing ? editableComponent : component}
    </Flex>
  );
};

export default Section;
