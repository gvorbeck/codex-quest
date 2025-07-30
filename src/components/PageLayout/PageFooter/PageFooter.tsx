import { Flex, Typography } from "antd";
import React from "react";
import { version, bfrpgEdition } from "../../../../package.json";
import { clsx } from "clsx";
import { Link } from "wouter";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PageFooterProps {}

const PageFooter: React.FC<
  PageFooterProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const footerClassNames = clsx(
    className,
    "[&_div]:text-springWood",
    "[&_a]:text-seaBuckthorn",
    "relative",
  );

  return (
    <div className={footerClassNames}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-shipGray to-transparent opacity-50 pointer-events-none"></div>

      <Flex className="relative z-10" vertical>
        <Typography.Paragraph className="text-center">
          <span data-testid="copyright-year">
            © {new Date().getFullYear()}{" "}
          </span>
          <a
            href="https://iamgarrett.com"
            rel="noreferrer noopener"
            target="_blank"
            data-testid="author-link"
            className="hover:text-california transition-colors duration-300 font-medium"
          >
            J. Garrett Vorbeck
          </a>
          .{" "}
          <span data-testid="site-title" className="font-enchant">
            CODEX.QUEST
          </span>{" "}
          <span
            data-testid="version-number"
            className="px-2 py-1 bg-gradient-to-r from-seaBuckthorn to-california text-shipGray text-xs rounded-full font-bold"
          >
            v{version}
          </span>
        </Typography.Paragraph>

        <Typography.Paragraph className="text-center">
          This site is based on the&nbsp;
          <a
            href="https://basicfantasy.org"
            rel="noreferrer noopener"
            target="_blank"
            data-testid="bfrpg-link"
            className="hover:text-california transition-colors duration-300 font-medium underline decoration-seaBuckthorn"
          >
            Basic Fantasy Role-Playing Game
          </a>{" "}
          (<span data-testid="bfrpg-edition">{bfrpgEdition}</span> Edition)
        </Typography.Paragraph>

        <Flex
          wrap="wrap"
          className="[&_a]:text-seaBuckthorn [&_*]:m-0 [&_a]:transition-colors [&_a]:duration-300 [&_a:hover]:text-california"
          gap={16}
          justify="center"
        >
          <Typography.Paragraph>
            <a
              href="https://github.com/gvorbeck/codex-quest/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer noopener"
              data-testid="license-link"
              className="hover:underline"
            >
              License
            </a>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <a
              href="mailto:me@iamgarrett.com"
              data-testid="contact-link"
              className="hover:underline"
            >
              Contact
            </a>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <a
              href="https://github.com/gvorbeck/codex-quest"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="github-link"
              className="hover:underline"
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
              className="hover:underline"
            >
              Privacy Policy
            </a>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <a
              href="https://www.paypal.com/donate/?business=4BW6AR5BGQZYW&no_recurring=0&item_name=for+CODEX.QUEST+database+fees&currency_code=USD"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-gradient-to-r from-sushi to-forestGreen rounded-full font-medium hover:scale-105 transition-transform duration-300 shadow-sm"
            >
              Donate
            </a>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <a
              href="https://bsky.app/profile/codex.quest"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Bluesky
            </a>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Link to="/sources" className="hover:underline">
              Sources
            </Link>
          </Typography.Paragraph>
        </Flex>
      </Flex>
    </div>
  );
};

export default PageFooter;
