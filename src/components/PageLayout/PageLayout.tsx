import { Alert, Flex, FloatButton, Layout } from "antd";
import React from "react";
import PageHeader from "./PageHeader/PageHeader";
import PageFooter from "./PageFooter/PageFooter";
import { useLocation } from "wouter";
import { User } from "firebase/auth";
import { clsx } from "clsx";
import { UserAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";

interface PageLayoutProps {
  user: User | null;
  alert?: React.ReactNode;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ user, alert, children }) => {
  const contentWidthClassName = "max-w-[1200px] mx-auto w-full";
  const layoutContentClassName = clsx(contentWidthClassName, "p-4", "relative");
  const [location, navigate] = useLocation();
  const isHomePage = location === "/";
  return (
    <Layout className="flex flex-col min-h-[100vh]">
      <Layout.Header className="flex items-center" data-testid="site-header">
        <PageHeader user={user} className={contentWidthClassName} />
      </Layout.Header>
      {alert && <Alert banner message={alert} type="info" closable />}
      <Layout.Content
        className={layoutContentClassName}
        data-testid="site-content"
      >
        <Flex vertical gap={16}>
          {isHomePage && user && (
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
          {children}
        </Flex>
      </Layout.Content>
      <Layout.Footer data-testid="site-footer">
        <PageFooter className={contentWidthClassName} />
      </Layout.Footer>
    </Layout>
  );
};

export default PageLayout;
