import { Flex, Typography } from "antd";
import React from "react";
import { version, bfrpgRelease, bfrpgEdition } from "../../../../package.json";
import classNames from "classnames";
import { Link } from "react-router-dom";
interface PageFooterProps {}

const PageFooter: React.FC<
  PageFooterProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const footerClassNames = classNames(
    className,
    "[&_div]:text-springWood",
    "[&_a]:text-seaBuckthorn",
  );
  return (
    <Flex className={footerClassNames} vertical>
      <Typography.Paragraph>
        <span data-testid="copyright-year">© {new Date().getFullYear()} </span>
        <a
          href="https://iamgarrett.com"
          rel="noreferrer noopener"
          target="_blank"
          data-testid="author-link"
        >
          J. Garrett Vorbeck
        </a>
        . <span data-testid="all-rights-reserved">All rights reserved.</span>{" "}
        <span data-testid="site-title">CODEX.QUEST</span>{" "}
        <span data-testid="version-number">v{version}</span>
      </Typography.Paragraph>
      <Typography.Paragraph>
        This site is based on the&nbsp;
        <a
          href="https://basicfantasy.org"
          rel="noreferrer noopener"
          target="_blank"
          data-testid="bfrpg-link"
        >
          Basic Fantasy Role-Playing Game
        </a>{" "}
        and is current to{" "}
        <span data-testid="bfrpg-edition">{bfrpgEdition}</span> Edition (release{" "}
        <span data-testid="bfrpg-release">{bfrpgRelease}</span>).
      </Typography.Paragraph>
      <Flex wrap="wrap" className="[&_a]:text-seaBuckthorn [&_*]:m-0" gap={16}>
        <Typography.Paragraph>
          <a
            href="https://github.com/gvorbeck/codex-quest/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer noopener"
            data-testid="license-link"
          >
            License
          </a>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <a href="mailto:me@iamgarrett.com" data-testid="contact-link">
            Contact
          </a>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <a
            href="https://github.com/gvorbeck/codex-quest"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="github-link"
          >
            GitHub
          </a>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <a
            href="https://www.freeprivacypolicy.com/live/fbe666aa-8172-4c25-86b3-f8b190191f9c"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="privacy-policy-link"
          >
            Privacy Policy
          </a>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <a
            href="https://www.paypal.com/donate/?business=4BW6AR5BGQZYW&no_recurring=0&item_name=for+CODEX.QUEST+database+fees&currency_code=USD"
            target="_blank"
            rel="noopener noreferrer"
          >
            Donate
          </a>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <a
            href="https://bsky.app/profile/codex.quest"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bluesky
          </a>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Link to="/sources">Sources</Link>
        </Typography.Paragraph>
      </Flex>
    </Flex>
  );
};

export default PageFooter;
