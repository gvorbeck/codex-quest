import { Divider, Typography } from "antd";
import { FooterContentProps } from "./types";
import { Link } from "react-router-dom";

export default function FooterContent({ className }: FooterContentProps) {
  return (
    <div className={`${className}`}>
      <Typography.Paragraph>
        © 2023 J. Garrett Vorbeck. All rights reserved.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Credits: This site is based on the&nbsp;
        <a
          href="https://basicfantasy.org"
          rel="noreferrer noopener"
          target="_blank"
        >
          Basic Fantasy Role-Playing Game created by Chris Gonnerman
        </a>{" "}
        and is current to release 130.
      </Typography.Paragraph>
      <div className="flex">
        <Typography.Paragraph>
          <a
            href="https://github.com/gvorbeck/codex-quest/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer noopener"
          >
            License
          </a>
        </Typography.Paragraph>
        <Divider type="vertical" />
        <Typography.Paragraph>
          <a href="mailto:me@iamgarrett.com">Contact</a>
        </Typography.Paragraph>
        <Divider type="vertical" />
        <Typography.Paragraph>
          <a
            href="https://github.com/gvorbeck/codex-quest"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </Typography.Paragraph>
        <Divider type="vertical" />
        <Typography.Paragraph>
          <Link to="https://www.freeprivacypolicy.com/live/fbe666aa-8172-4c25-86b3-f8b190191f9c">
            Privacy Policy
          </Link>
        </Typography.Paragraph>
      </div>
    </div>
  );
}
