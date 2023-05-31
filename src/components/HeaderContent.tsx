import { Button, Space, Typography } from "antd";
import CreateCharacterModal from "./CreateCharacterModal/CreateCharacterModal";
import { useState } from "react";
import { HeaderContentProps } from "./types";

const { Paragraph } = Typography;

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
    <header>
      {user ? (
        <Space align="center">
          <Button type="primary" onClick={showModal}>
            Create BFRPG Character
          </Button>
          <Paragraph>{user.displayName}</Paragraph>
          <Button type="link" onClick={() => auth.signOut()}>
            Log out
          </Button>
        </Space>
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
    </header>
  );
}
