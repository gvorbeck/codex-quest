import { Avatar, Card, Col, Empty, Row } from "antd";
import { CharacterListProps } from "./types";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

export default function CharacterList({
  user,
  characters,
}: CharacterListProps) {
  return (
    <div>
      {characters.length ? (
        <Row justify={"space-between"} className="gap-y-8">
          {characters.map((character) => (
            <Col span={5} key={character.id}>
              <Card
                className="bg-seaBuckthorn"
                extra={
                  <Link to={`/users/${user?.uid}/character/${character.id}`}>
                    Open
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
                      <Avatar icon={<UserOutlined />} />
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
