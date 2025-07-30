import { Flex, Image, Typography } from "antd";
import React from "react";
import CharacterSheet from "@/assets/images/screenshot.webp";
import SiteLogo from "@/assets/images/dragon-head.webp";
import { useDeviceType } from "@/hooks/useDeviceType";

const PageWelcome: React.FC = () => {
  const { isMobile } = useDeviceType();
  return (
    <Flex gap={32} vertical={isMobile ? true : false}>
      <div className="flex-[0_0_50%]">
        <Image
          src={SiteLogo}
          alt="Codex quest logo"
          preview={false}
          className="w-[50%] mx-auto block mb-4 transition-transform duration-300 hover:scale-105"
        />
        <Typography.Title
          level={2}
          className="text-3xl md:text-4xl font-bold mt-0 font-enchant tracking-wider"
        >
          Hail fellow well met!
        </Typography.Title>
        <Typography.Paragraph>
          Welcome to CODEX.QUEST, the ultimate companion for{" "}
          <a href="https://basicfantasy.org" target="_blank" rel="noreferrer">
            Basic Fantasy RPG
          </a>
          .
        </Typography.Paragraph>
        <Typography.Paragraph>
          Designed with the player in mind, this platform streamlines character
          creation, providing an intuitive, user-friendly interface to craft
          your unique character. From defining your character's abilities to
          equipping them with the right gear, CODEX.QUEST ensures a seamless and
          immersive gaming experience.
        </Typography.Paragraph>
        <Typography.Paragraph>
          CODEX.QUEST is not just a tool; it's a companion designed to guide you
          on your characters' adventures. Make the most of your gaming
          experience by letting CODEX.QUEST handle the complexities of character
          management, giving you more time to dive into the captivating
          narratives and thrilling encounters that BFRPG offers. Best of all,
          it's 100% FREE!
        </Typography.Paragraph>
        <Typography.Title
          level={2}
          className="text-3xl md:text-4xl font-bold font-enchant tracking-wider"
        >
          Bring Your Characters to Life
        </Typography.Title>
        <Typography.Paragraph>
          <ul>
            <li>
              Create, store, and play as an infinite number of characters.
            </li>
            <li>
              Access all the official races, classes, and equipment as well as
              virtually all of the supplemental releases.
            </li>
            <li>
              Go even further and create custom races, classes, and equipment to
              bring your unique character to life.
            </li>
            <li>
              Roll initiative, attack, damage, saving throws, and special
              abilities with our easy-to-use interface. Our Virtual Dice Tool
              also lets you roll any other dice you need.
            </li>
            <li>
              GM mode allows you to add players' characters and monitor their
              stats for your whole game.
            </li>
            <li>Share your characters with anyone using unique URLs.</li>
            <li>More features being added all the time!</li>
          </ul>
        </Typography.Paragraph>
      </div>
      <Image
        src={CharacterSheet}
        alt="Sample Basic Fantasy Role-Playing Game Character Sheet"
        className="border-solid border-1 border-shipGray shadow-md flex-[0_0_50%] modern-card"
      />
    </Flex>
  );
};

export default PageWelcome;
