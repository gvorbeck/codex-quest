import { Avatar, Button, Card, Col, Empty, Row } from "antd";
import { CharacterListProps } from "./types";
import { Link } from "react-router-dom";
import { UserOutlined, SolutionOutlined } from "@ant-design/icons";

export default function CharacterList({
  user,
  characters,
}: CharacterListProps) {
  return (
    <div>
      {characters.length ? (
        <Row justify={"start"} className="gap-8">
          {characters.map((character) => (
            <Col span={5} key={character.id}>
              <Card
                className="bg-seaBuckthorn"
                extra={
                  <Link to={`/u/${user?.uid}/c/${character.id}`}>
                    <Button
                      className="bg-zorba bg-opacity-25 !border-transparent hover:border-transparent hover:bg-opacity-40"
                      icon={<SolutionOutlined />}
                      aria-label="Open character sheet"
                    />
                  </Link>
                }
                title={character.name}
              >
                <Card.Meta
                  description={`${character.race} - ${character.class} - ${character.id}`}
                  avatar={
                    character.avatar ? (
                      <Avatar src={character.avatar} />
                    ) : (
                      <Avatar
                        className="text-seaBuckthorn"
                        icon={<UserOutlined />}
                      />
                    )
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty />
      )}
    </div>
  );
}
