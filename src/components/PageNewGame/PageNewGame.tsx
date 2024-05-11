import { User } from "firebase/auth";
import React from "react";
import { Breadcrumb, Button, Flex, Form, Input } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import { createDocument } from "@/support/accountSupport";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { GameData } from "@/data/definitions";
import { breadcrumbItems } from "@/support/cqSupportGeneral";
import NewContentHeader from "../NewContentHeader/NewContentHeader";

interface PageNewGameProps {
  user: User | null;
  handleTabChange: (key: string) => void;
}

const PageNewGame: React.FC<
  PageNewGameProps & React.ComponentPropsWithRef<"div">
> = ({ className, handleTabChange }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values: GameData) => {
    handleTabChange("2");
    const newGame: GameData = { ...values, combatants: [] };
    // Call createDocument to create a new game document
    await createDocument(
      auth.currentUser,
      "games", // Assuming "games" is the collection name for games
      newGame, // The form data
      (name) => {
        console.info(`Game '${name}' created successfully.`);
        // You can add any additional logic after successful creation
      },
      (error) => {
        console.error(`Error creating game: ${error}`);
        // Error handling logic
      },
      () => {
        navigate("/");
      },
    );
  };

  const newGameDescription = `Create a new Basic Fantasy RPG game. You will be the Game Master and will be able to add players to your game using their characters' unique URLs.`;

  return (
    <Flex gap={16} vertical>
      <Breadcrumb
        items={breadcrumbItems("New Character", UsergroupAddOutlined)}
      />
      <NewContentHeader title="New Game" description={newGameDescription} />
      <Form
        form={form}
        name="new-game-form"
        onFinish={onFinish}
        className={className}
      >
        <Form.Item name="name" label="Game Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default PageNewGame;
