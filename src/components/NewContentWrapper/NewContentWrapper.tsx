import { Divider, Flex, Typography } from "antd";
import classNames from "classnames";
import React from "react";
import { newGameCharacterPageTitleClassNames } from "@/support/classNameSupport";

interface NewContentWrapperProps {
  title: string;
  markedDesc: string;
}

const NewContentWrapper: React.FC<
  NewContentWrapperProps & React.ComponentPropsWithRef<"div">
> = ({ className, title, markedDesc, children }) => {
  const newContentWarpperClassNames = classNames(className, "mt-4");
  return (
    <Flex vertical gap={16} className={newContentWarpperClassNames}>
      <Typography.Title
        level={2}
        className={newGameCharacterPageTitleClassNames}
      >
        {title}
      </Typography.Title>
      <Typography.Paragraph className="m-0 [&_p]:m-0 [&_p+p]:mt-4">
        <span dangerouslySetInnerHTML={{ __html: markedDesc }} />
      </Typography.Paragraph>
      <Divider />
      {children}
    </Flex>
  );
};

export default NewContentWrapper;
