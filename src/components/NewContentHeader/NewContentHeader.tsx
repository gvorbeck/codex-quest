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
    <section className={`animate-fade-in ${className}`}>
      <div className="space-y-4">
        <Typography.Title
          level={2}
          className="m-0 text-center font-enchant leading-none tracking-wide text-4xl"
        >
          {title}
        </Typography.Title>

        <div className="h-1 w-24 bg-gradient-to-r from-seaBuckthorn to-california rounded-full mx-auto"></div>

        <Typography.Paragraph className="m-0 [&_p]:m-0 [&_p+p]:mt-4 max-w-2xl text-lg">
          <LightMarkdown>{description}</LightMarkdown>
        </Typography.Paragraph>
      </div>

      <Divider className="mt-6 border-seaBuckthorn" />
    </section>
  );
};

export default NewContentHeader;
