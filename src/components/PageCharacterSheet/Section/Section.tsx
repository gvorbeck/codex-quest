import { Button, Flex, Tooltip, Typography } from "antd";
import React from "react";
import HelpTooltip from "@/components/HelpTooltip/HelpTooltip";
import { EditOutlined } from "@ant-design/icons";

interface SectionProps {
  component: React.ReactNode;
  title: string;
  titleHelpText?: string;
  editableComponent?: React.ReactNode;
  editable?: boolean;
}

const Section: React.FC<SectionProps & React.ComponentPropsWithRef<"div">> = ({
  className,
  component,
  title,
  titleHelpText,
  editable,
  editableComponent,
}) => {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const handleEditClick = () => {
    const editing = !isEditing;
    setIsEditing(editing);
  };

  return (
    <Flex vertical className={className}>
      <Flex gap={16} align="baseline">
        <Typography.Title level={3} className="mt-0 leading-none">
          {title}
        </Typography.Title>
        {editable && (
          <Tooltip title={isEditing ? "Save" : "Edit"}>
            <Button
              type={isEditing ? "primary" : "link"}
              icon={<EditOutlined className="cursor" />}
              onClick={handleEditClick}
              className="shadow-none"
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
