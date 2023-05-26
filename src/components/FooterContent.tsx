import { Typography } from "antd";

export default function FooterContent() {
  return (
    <div>
      <Typography.Paragraph>
        Codex Quest is created by J. Garrett Vorbeck
      </Typography.Paragraph>
      <Typography.Paragraph>
        © 2023 [Your Name]. All rights reserved.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Credits:{" "}
        <a href="[BFRPG URL]">
          Basic Fantasy Role-Playing Game created by Chris Gonnerman
        </a>
      </Typography.Paragraph>
      <Typography.Paragraph>
        License: <a href="[Link to MIT License]">MIT License</a>
      </Typography.Paragraph>
      <Typography.Paragraph>
        Contact:{" "}
        <a href="mailto:your-email@example.com">your-email@example.com</a>
      </Typography.Paragraph>
      <Typography.Paragraph>
        Github: <a href="[BFRPG URL]">Codex Quest Repository</a>
      </Typography.Paragraph>
      <Typography.Paragraph>
        <a href="[Link to Privacy Policy]">Privacy Policy</a> |{" "}
        <a href="[Link to Terms of Use]">Terms of Use</a>
      </Typography.Paragraph>
    </div>
  );
}
