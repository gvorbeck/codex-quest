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
        <Row justify={"space-evenly"}>
          {characters.map((character) => (
            <Col span={4} key={character.id}>
              <Link to={`/users/${user?.uid}/character/${character.id}`}>
                <Card hoverable>
                  <Card.Meta
                    title={character.name}
                    description={`${character.race} - ${character.class} - ${character.id}`}
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty />
      )}
    </div>
  );
}
