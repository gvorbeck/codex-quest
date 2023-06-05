import { Button, Col, Row, Space, Typography } from "antd";
import CreateCharacterModal from "./CreateCharacterModal/CreateCharacterModal";
import { useState } from "react";
import { HeaderContentProps } from "./types";

export default function HeaderContent({
  auth,
  handleLogin,
  user,
  onCharacterAdded,
}: HeaderContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <Row>
        <Col flex={4} className="flex items-center">
          <Typography.Title level={1} className="!mb-0 mt-0 leading-none mr-4">
            CODEX.QUEST
          </Typography.Title>
          {user && (
            <Button type="primary" onClick={showModal}>
              Create BFRPG Character
            </Button>
          )}
        </Col>
        <Col flex={1} className="flex justify-end">
          <Space>
            {user ? (
              <>
                <Typography.Text>{user.displayName}</Typography.Text>
                <Button type="primary" onClick={() => auth.signOut()}>
                  Log out
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={handleLogin}>
                Log in with Google
              </Button>
            )}
          </Space>
        </Col>
      </Row>
      <CreateCharacterModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onCharacterAdded={onCharacterAdded}
      />
    </>
  );
}
