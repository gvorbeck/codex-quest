import { Divider, Flex, Typography } from "antd";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { marked } from "marked";
import { newGameCharacterPageTitleClassNames } from "@/support/cssSupport";

interface NewContentWrapperProps {
  title: string;
  markedDesc: string | Promise<string>;
}

const isPromise = (value: unknown): value is Promise<string> => {
  return value instanceof Promise;
};

const NewContentWrapper: React.FC<
  NewContentWrapperProps & React.ComponentPropsWithRef<"div">
> = ({ className, title, markedDesc, children }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const newContentWrapperClassNames = classNames(className, "mt-4");

  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        let contentToParse: string;

        if (isPromise(markedDesc)) {
          contentToParse = await markedDesc; // Wait for the promise to resolve
        } else {
          contentToParse = markedDesc; // Directly use the string
        }

        const result = await marked.parse(contentToParse);
        setHtmlContent(result);
      } catch (error) {
        console.error("Error parsing markdown:", error);
        setHtmlContent("");
      }
    };

    parseMarkdown();
  }, [markedDesc]);

  return (
    <Flex vertical gap={16} className={newContentWrapperClassNames}>
      <Typography.Title
        level={2}
        className={newGameCharacterPageTitleClassNames}
      >
        {title}
      </Typography.Title>
      <Typography.Paragraph className="m-0 [&_p]:m-0 [&_p+p]:mt-4">
        <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Typography.Paragraph>
      <Divider />
      {children}
    </Flex>
  );
};

export default NewContentWrapper;
