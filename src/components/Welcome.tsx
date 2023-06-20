import { Image, Typography } from "antd";
// import deadlyStrike from "../assets/images/deadly-strike.png";
import { useOutletContext } from "react-router-dom";
import IronhideSheet from "../assets/images/ironhide_sheet.png";

export default function Welcome() {
  const outletContext = useOutletContext() as { className: string };
  return (
    <div
      className={`${outletContext.className} grid grid-cols-1 md:grid-cols-2 gap-8`}
    >
      <div>
        <div>
          <Typography.Title
            level={2}
            className="text-shipGray text-3xl md:text-4xl font-bold mt-0"
          >
            Welcome to CODEX.QUEST!
          </Typography.Title>
          <Typography.Paragraph>
            Welcome to CODEX.QUEST, your ultimate companion for character
            creation in the world of{" "}
            <a href="https://basicfantasy.org" target="_blank" rel="noreferrer">
              Basic Fantasy RPG
            </a>
            . Designed with the player in mind, this platform streamlines
            character creation, allowing you to dive into your adventures with
            ease.
          </Typography.Paragraph>
          <Typography.Paragraph>
            CODEX.QUEST provides an intuitive, user-friendly interface to craft
            your unique character. From defining your character's abilities to
            equipping them with the right gear, CODEX.QUEST ensures a seamless
            and immersive gaming experience.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Join us at CODEX.QUEST and let your epic journey in the world of
            Basic Fantasy RPG begin!
          </Typography.Paragraph>
        </div>
        <div>
          <Typography.Title
            level={2}
            className="text-shipGray text-3xl md:text-4xl font-bold"
          >
            Bring Your Characters to Life
          </Typography.Title>
          <Typography.Paragraph>
            Developed specifically for BFRPG's 4th edition, our tool covers all
            the basic races and classes, ensuring a comprehensive character
            creation experience that is both versatile and detailed.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Whether you're a mighty Dwarf Fighter, a cunning Elf Magic-User, or
            exploring the unique dynamics of combination classes, CODEX.QUEST
            has you covered. Best of all, it's 100% FREE!
          </Typography.Paragraph>
          <Typography.Paragraph>
            CODEX.QUEST is not just a tool; it's a companion designed to guide
            you on your characters' adventures. Make the most of your gaming
            experience by letting CODEX.QUEST handle the complexities of
            character management, giving you more time to dive into the
            captivating narratives and thrilling encounters that BFRPG offers.
          </Typography.Paragraph>
        </div>
      </div>
      {/* <Image src={deadlyStrike} preview={false} className="hidden" /> */}
      <Image
        src={IronhideSheet}
        alt="Sample Basic Fantasy Role-Playing Game Character Sheet"
        className="border-solid border-1 shadow-md"
      />
    </div>
  );
}
