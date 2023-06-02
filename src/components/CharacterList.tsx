import { Card, Col, Empty, Row } from "antd";
import { CharacterListProps } from "./types";
import { Link } from "react-router-dom";

export default function CharacterList({
  user,
  characters,
}: CharacterListProps) {
  return (
    <div>
      {characters.length ? (
        <Row justify={"space-evenly"} className="gap-8">
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
