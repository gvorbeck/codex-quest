import { Image, Typography } from "antd";
import { useOutletContext } from "react-router-dom";
import IronhideSheet from "../../assets/images/ironhide_sheet.png";
import classNames from "classnames";

export default function Welcome() {
  const outletContext = useOutletContext() as { className: string };
  const welcomeClassNames = classNames(
    outletContext.className,
    "grid",
    "grid-cols-1",
    "md:grid-cols-2",
    "gap-8"
  );
  return (
    <div className={welcomeClassNames}>
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
            .
          </Typography.Paragraph>
          <Typography.Paragraph>
            Designed with the player in mind, this platform streamlines
            character creation, providing an intuitive, user-friendly interface
            to craft your unique character. From defining your character's
            abilities to equipping them with the right gear, CODEX.QUEST ensures
            a seamless and immersive gaming experience.
          </Typography.Paragraph>
          <Typography.Paragraph>
            CODEX.QUEST is not just a tool; it's a companion designed to guide
            you on your characters' adventures. Make the most of your gaming
            experience by letting CODEX.QUEST handle the complexities of
            character management, giving you more time to dive into the
            captivating narratives and thrilling encounters that BFRPG offers.
            Best of all, it's 100% FREE!
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
            <ul>
              <li>
                Create, store, and play as an infinite number of characters.
              </li>
              <li>
                Access all the official races, classes, and equipment as well as
                virtually all of the supplemental releases.
              </li>
              <li>
                Go even further and create custom races and classes to bring
                your unique character to life.
              </li>
              <li>
                Roll initiative, attack, damage, saving throws, and special
                abilities with our easy-to-use interface. Our Virtual Dice Tool
                also lets you roll any other dice you need.
              </li>
              <li>
                Manage your equipment, money, HP, bio, XP, conditions/wounds,
                spells, and more.
              </li>
              <li>Share your characters with anyone using unique URLs.</li>
              <li>More features being added all the time!</li>
            </ul>
          </Typography.Paragraph>
        </div>
      </div>
      <Image
        src={IronhideSheet}
        alt="Sample Basic Fantasy Role-Playing Game Character Sheet"
        className="border-solid border-1 shadow-md"
      />
    </div>
  );
}
