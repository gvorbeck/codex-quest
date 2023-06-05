import { Col, Image, Row, Typography } from "antd";
import deadlyStrike from "../assets/images/deadly-strike.png";

export default function Welcome() {
  return (
    <Row>
      <Col span={12}>
        <Typography.Title
          level={2}
          className="!text-shipGray !text-4xl !font-bold"
        >
          Welcome to CODEX.QUEST!
        </Typography.Title>
        <Typography.Paragraph>
          Welcome to CODEX.QUEST, your ultimate companion for character creation
          in the world of{" "}
          <a href="https://basicfantasy.org" target="_blank" rel="noreferrer">
            Basic Fantasy RPG
          </a>
          . Designed with the player in mind, our platform streamlines the
          process of character creation, allowing you to dive into your
          adventures quicker and with ease. Whether you're a seasoned adventurer
          or a newcomer to the realm of Basic Fantasy RPG, CODEX.QUEST provides
          an intuitive, user-friendly interface to craft your unique character.
          From defining your character's abilities to equipping them with the
          right gear, CODEX.QUEST is there every step of the way, ensuring a
          seamless and immersive gaming experience. Join us at CODEX.QUEST and
          let your epic journey in the world of Basic Fantasy RPG begin!
        </Typography.Paragraph>
      </Col>
      <Col span={12}>
        <Image src={deadlyStrike} preview={false} />
      </Col>
    </Row>
  );
}
