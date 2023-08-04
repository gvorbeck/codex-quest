import { Avatar, Card, Col, Empty, Popconfirm, Row, Spin } from "antd";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  UserOutlined,
  SolutionOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { CharacterListProps } from "./definitions";

export default function CharacterList({
  user,
  characters,
  onCharacterDeleted,
}: CharacterListProps) {
  const navigate = useNavigate();
  const outletContext = useOutletContext() as { className: string };
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    setLoading(false);
  }, [characters]);
  return (
    <div className={`${outletContext.className}`}>
      {loading ? (
        <Spin />
      ) : characters.length ? (
        <Row justify={"start"} gutter={32} className="gap-y-9">
          {characters.map((character) => (
            <Col xs={24} md={12} lg={6} key={character.id}>
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
                      aria-label="Delete character"
                      title="Delete character"
                    />
                  </Popconfirm>,
                ]}
                className="h-full flex flex-col justify-between"
              >
                <Card.Meta
                  description={
                    <div className="flex flex-col items-center">
                      <span>Level {character.level}</span>
                      <span>{character.race}</span>
                      <span>{character.class}</span>
                    </div>
                  }
                  className="flex-col [&>.ant-card-meta-avatar]:self-center [&>.ant-card-meta-avatar]:pr-0 [&>.ant-card-meta-avatar]:mb-2 [&>.ant-card-meta-avatar]:text-springWood"
                  avatar={
                    character.avatar ? (
                      <Avatar
                        size={64}
                        src={character.avatar}
                        alt={character.name}
                      />
                    ) : (
                      <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        alt={character.name}
                      />
                    )
                  }
                  title={
                    <span className="text-center block">{character.name}</span>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Create your first character by clicking the button above." />
      )}
    </div>
  );
}
