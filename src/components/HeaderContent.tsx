import React, { Suspense, useState } from "react";
import { Button, Col, Row, Typography } from "antd";
import { HeaderContentProps } from "./types";

const CreateCharacterModal = React.lazy(
  () => import("./CreateCharacterModal/CreateCharacterModal")
);

export default function HeaderContent({
  auth,
  handleLogin,
  user,
  onCharacterAdded,
  className,
}: HeaderContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <Row className={`${className} gap-y-4`}>
      <Col
        xs={24}
        md={12}
        className="text-center leading-none lg:flex lg:justify-start lg:items-center"
      >
        <Typography.Title
          level={1}
          className="!mb-0 mt-0 leading-none text-4xl"
        >
          CODEX.QUEST
        </Typography.Title>
        {user && (
          <Button
            type="primary"
            onClick={showModal}
            className="mt-4 lg:mt-0 lg:ml-4 leading-none"
          >
            Create BFRPG Character
          </Button>
        )}
      </Col>
      <Col
        xs={24}
        md={12}
        className="text-center flex flex-col md:justify-center lg:flex-row lg:items-center lg:justify-end"
      >
        {user ? (
          <>
            <Typography.Text className="leading-none">
              {user.displayName}
            </Typography.Text>
            <Button
              type="primary"
              onClick={() => auth.signOut()}
              className="w-1/2 mx-auto mt-4 lg:m-0 lg:ml-4 leading-none"
            >
              Log out
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            Log in with Google
          </Button>
        )}
        {user && (
          <Suspense fallback={<div>Loading...</div>}>
            <CreateCharacterModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              onCharacterAdded={onCharacterAdded}
            />
          </Suspense>
        )}
      </Col>
    </Row>
  );
}
