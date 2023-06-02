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
      {user ? (
        <Row>
          <Col flex={4}>
            <Button type="primary" onClick={showModal}>
              Create BFRPG Character
            </Button>
          </Col>
          <Col flex={1} className="flex justify-end">
            <Space>
              <Typography.Text>{user.displayName}</Typography.Text>
              <Button type="primary" onClick={() => auth.signOut()}>
                Log out
              </Button>
            </Space>
          </Col>
        </Row>
      ) : (
        <Button type="primary" onClick={handleLogin}>
          Log in with Google
        </Button>
      )}
      <CreateCharacterModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onCharacterAdded={onCharacterAdded}
      />
    </>
  );
}
