import { Alert, Flex, FloatButton, Layout } from "antd";
import React from "react";
import PageHeader from "./PageHeader/PageHeader";
import PageFooter from "./PageFooter/PageFooter";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import classNames from "classnames";
import { UserAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";

interface PageLayoutProps {
  user: User | null;
}

const PageLayout: React.FC<PageLayoutProps> = ({ user }) => {
  const contentWidthClassName = "max-w-[1200px] mx-auto w-full";
  const layoutContentClassName = classNames(contentWidthClassName, "p-4");
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();
  return (
    <Layout className="flex flex-col min-h-[100vh]">
      <Layout.Header className="flex items-center">
        <PageHeader user={user} className={contentWidthClassName} />
      </Layout.Header>
      <Alert
        banner
        message={
          <span>
            Welcome to v2.0! If you see something isn't working, comment{" "}
            <a
              target="_blank"
              href="https://github.com/gvorbeck/codex-quest/issues/216"
            >
              HERE
            </a>
            , create an issue, or make a Pull Request in my GitHub.
          </span>
        }
        type="info"
      />
      <Layout.Content className={layoutContentClassName}>
        <Flex vertical gap={16}>
          {isHomePage && (
            <FloatButton.Group shape="square">
              <FloatButton
                icon={<UserAddOutlined />}
                tooltip={<div>Create New Character</div>}
                onClick={() => navigate("/new-character")}
              />
              <FloatButton
                icon={<UsergroupAddOutlined />}
                tooltip={<div>Create New Game</div>}
                onClick={() => navigate("/new-game")}
              />
            </FloatButton.Group>
          )}
          <Outlet context={{ user, className: "" }} />
        </Flex>
      </Layout.Content>
      <Layout.Footer>
        <PageFooter className={contentWidthClassName} />
      </Layout.Footer>
    </Layout>
  );
};

export default PageLayout;
