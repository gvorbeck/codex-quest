import { Avatar, Card, Col, Empty, Popconfirm, Row } from "antd";
import { CharacterListProps } from "./types";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  SolutionOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function CharacterList({
  user,
  characters,
  onCharacterDeleted,
}: CharacterListProps) {
  const navigate = useNavigate();

  const confirm = async (characterId: string) => {
    if (user) {
      const characterDoc = doc(
        db,
        `users/${user.uid}/characters/${characterId}`
      );
      await deleteDoc(characterDoc);
      onCharacterDeleted();
    }
  };
  return (
    <div>
      {characters.length ? (
        <Row justify={"start"} className="gap-8">
          {characters.map((character) => (
            <Col span={5} key={character.id}>
              <Card
                actions={[
                  <SolutionOutlined
                    key="sheet"
                    onClick={() =>
                      navigate(`/u/${user?.uid}/c/${character.id}`)
                    }
                    title="Go to Character Sheet"
                    aria-label="Go to Character Sheet"
                  />,
                  <Popconfirm
                    title="Delete this character?"
                    description={`This cannot be undone!`}
                    onConfirm={() => character?.id && confirm(character.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined
                      key="delete"
                      // onClick={() => console.log("delete character")}
                      aria-label="Delete character"
                      title="Delete character"
                    />
                  </Popconfirm>,
                ]}
                className="h-full flex flex-col justify-between"
              >
                <Card.Meta
                  description={`Level ${character.level} ${character.race} ${character.class}`}
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
                  title={character.name}
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
