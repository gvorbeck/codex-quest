import { Button, Col, Row, Typography } from "antd";
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
      <Row className="gap-4">
        <Col flex={4} className="flex items-center flex-col gap-4 md:flex-row">
          <Typography.Title
            level={1}
            className="!mb-0 mt-0 leading-none text-4xl"
          >
            CODEX.QUEST
          </Typography.Title>
          {user && (
            <Button type="primary" onClick={showModal}>
              Create BFRPG Character
            </Button>
          )}
        </Col>
        <Col flex={1} className="flex justify-center items-baseline gap-4">
          {user ? (
            <>
              <Typography.Text className="leading-none">
                {user.displayName}
              </Typography.Text>
              <Button type="primary" onClick={() => auth.signOut()}>
                Log out
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={handleLogin}>
              Log in with Google
            </Button>
          )}
          {user && (
            <CreateCharacterModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              onCharacterAdded={onCharacterAdded}
            />
          )}
        </Col>
      </Row>
    </>
  );
}
