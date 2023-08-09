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
          {characters
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((characterData) => (
              <Col xs={24} md={12} lg={6} key={characterData.id}>
                <Card
                  bodyStyle={{
                    backgroundColor: "#e2e8f0",
                    borderRadius: "0.5rem 0.5rem 0 0",
                    border: "1px solid rgba(62,53,67, 0.15)",
                    borderBottomWidth: "2px",
                  }}
                  actions={[
                    <SolutionOutlined
                      key="sheet"
                      onClick={() =>
                        navigate(`/u/${user?.uid}/c/${characterData.id}`)
                      }
                      title="Go to Character Sheet"
                      aria-label="Go to Character Sheet"
                    />,
                    <Popconfirm
                      title="Delete this character?"
                      description={`This cannot be undone!`}
                      onConfirm={() =>
                        characterData?.id && confirm(characterData.id)
                      }
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
                  className="h-full flex flex-col justify-between [&>ul]:border-t-solid [&>ul]:border-t-2 [&>ul]:border-[rgba(0,0,0,0.1)]"
                >
                  <Card.Meta
                    description={
                      <div className="flex flex-col items-center text-slate-600">
                        <span>Level {characterData.level}</span>
                        <span>{characterData.race}</span>
                        <span>{characterData.class}</span>
                      </div>
                    }
                    className="flex-col [&>.ant-card-meta-avatar]:self-center [&>.ant-card-meta-avatar]:pr-0 [&>.ant-card-meta-avatar]:mb-2 [&>.ant-card-meta-avatar]:text-springWood"
                    avatar={
                      characterData.avatar ? (
                        <Avatar
                          size={64}
                          src={characterData.avatar}
                          alt={characterData.name}
                          className="shadow-md border-solid border-2 border-seaBuckthorn"
                        />
                      ) : (
                        <Avatar
                          size={64}
                          icon={<UserOutlined />}
                          alt={characterData.name}
                          className="shadow-md border-solid border-2 border-seaBuckthorn"
                        />
                      )
                    }
                    title={
                      <span className="text-center block">
                        {characterData.name}
                      </span>
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
