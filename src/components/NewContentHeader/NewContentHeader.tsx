import { Divider, Typography } from "antd";
import React from "react";
import LightMarkdown from "@/components/LightMarkdown/LightMarkdown";

interface NewContentHeaderProps {
  title: string;
  description: string;
}

const NewContentHeader: React.FC<
  NewContentHeaderProps & React.ComponentPropsWithRef<"div">
> = ({ className, title, description }) => {
  return (
    <section className={className}>
      <Typography.Title
        level={2}
        className="m-0 font-enchant leading-none tracking-wide"
      >
        {title}
      </Typography.Title>
      <Typography.Paragraph className="m-0 [&_p]:m-0 [&_p+p]:mt-4">
        <LightMarkdown>{description}</LightMarkdown>
      </Typography.Paragraph>
      <Divider className="mt-4" />
    </section>
  );
};

export default NewContentHeader;
