import { User } from "firebase/auth";
import React from "react";
import NewContentWrapper from "../NewContentWrapper/NewContentWrapper";
import { marked } from "marked";
import { Breadcrumb, BreadcrumbProps, Button, Form, Input } from "antd";
import BreadcrumbHomeLink from "../BreadcrumbHomeLink/BreadcrumbHomeLink";
import { UsergroupAddOutlined } from "@ant-design/icons";
import { createDocument } from "@/support/accountSupport";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";

interface PageNewGameProps {
  user: User | null;
}

const breadcrumbItems: BreadcrumbProps["items"] = [
  { title: <BreadcrumbHomeLink /> },
  {
    title: (
      <div>
        <UsergroupAddOutlined className="mr-2" />
        <span>New Game</span>
      </div>
    ),
  },
];

const PageNewGame: React.FC<
  PageNewGameProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    // Call createDocument to create a new game document
    await createDocument(
      auth.currentUser,
      "games", // Assuming "games" is the collection name for games
      values, // The form data
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

  const newGameDescription = marked(
    `Create a new Basic Fantasy RPG game. You will be the Game Master and will be able to add players to your game using their characters' unique URLs.`,
  );
  return (
    <>
      <Breadcrumb items={breadcrumbItems} className="-mb-4" />
      <NewContentWrapper
        className={className}
        title={"New Game"}
        markedDesc={newGameDescription}
      >
        <Form form={form} name="new-game-form" onFinish={onFinish}>
          <Form.Item name="name" label="Game Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </NewContentWrapper>
    </>
  );
};

export default PageNewGame;
