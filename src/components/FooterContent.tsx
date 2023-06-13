import { Typography } from "antd";
import { FooterContentProps } from "./types";

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
      <Typography.Paragraph>
        License:{" "}
        <a
          href="https://github.com/gvorbeck/codex-quest/blob/main/LICENSE"
          target="_blank"
          rel="noreferrer noopener"
        >
          MIT License
        </a>
      </Typography.Paragraph>
      <Typography.Paragraph>
        Contact: <a href="mailto:me@iamgarrett.com">me@iamgarrett.com</a>
      </Typography.Paragraph>
      <Typography.Paragraph>
        Github:{" "}
        <a
          href="https://github.com/gvorbeck/codex-quest"
          target="_blank"
          rel="noopener noreferrer"
        >
          Codex Quest Repository
        </a>
      </Typography.Paragraph>
      <Typography.Paragraph>
        <a href="[Link to Privacy Policy]">Privacy Policy</a> |{" "}
        <a href="[Link to Terms of Use]">Terms of Use</a> |{" "}
        <a href="[Link to Cookie Policy]">Cookie Policy</a>
      </Typography.Paragraph>
    </div>
  );
}
