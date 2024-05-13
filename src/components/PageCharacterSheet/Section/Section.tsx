import { Button, Flex, Tooltip, Typography } from "antd";
import React from "react";
import HelpTooltip from "@/components/HelpTooltip/HelpTooltip";
import { EditOutlined } from "@ant-design/icons";

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

  function handleEditClick() {
    const editing = !isEditing;
    setIsEditing(editing);
  }

  const hasTitle = title ? (
    <Typography.Title level={3} className="mt-0 leading-none">
      {title}
    </Typography.Title>
  ) : null;
  const isEditable = editable ? (
    <Tooltip title={isEditing ? "Save" : "Edit"}>
      <Button
        type={isEditing ? "primary" : "link"}
        icon={<EditOutlined className="cursor" />}
        onClick={handleEditClick}
        className={"shadow-none " + editableClassName}
      />
    </Tooltip>
  ) : null;
  const titleHelp = titleHelpText ? <HelpTooltip text={titleHelpText} /> : null;
  const editing = isEditing ? editableComponent : component;

  return (
    <Flex vertical className={className}>
      <Flex gap={16} align="baseline">
        {hasTitle}
        {isEditable}
        {titleHelp}
      </Flex>
      {editing}
    </Flex>
  );
};

export default Section;
