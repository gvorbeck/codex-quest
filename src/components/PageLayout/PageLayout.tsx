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
    <Layout className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-linear-to-br from-spring-wood via-stone to-ship-gray opacity-10 pointer-events-none"></div>
      <div className="fixed top-20 left-10 w-96 h-96 bg-linear-to-r from-sea-buckthorn to-california rounded-full opacity-5 blur-3xl pointer-events-none animate-float"></div>
      <div
        className="fixed bottom-20 right-10 w-64 h-64 bg-linear-to-r from-mystic-purple to-deep-blue rounded-full opacity-5 blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <Layout.Header
        className="flex items-center relative z-10 backdrop-blur-xs bg-ship-gray bg-opacity-95 border-b border-sea-buckthorn border-opacity-20"
        data-testid="site-header"
      >
        <PageHeader user={user} className={contentWidthClassName} />
      </Layout.Header>

      {alert && (
        <Alert
          banner
          message={alert}
          type="info"
          closable
          className="relative z-10 border-sea-buckthorn border-opacity-30 bg-linear-to-r from-sea-buckthorn to-california text-ship-gray font-medium"
        />
      )}

      <Layout.Content
        className={`${layoutContentClassName} relative z-10 flex-1`}
        data-testid="site-content"
      >
        <Flex vertical gap={16} className="animate-fade-in">
          {isHomePage && user && (
            <FloatButton.Group shape="square" className="pulse-glow">
              <FloatButton
                icon={<UserAddOutlined />}
                tooltip={{
                  title: "Create New Character",
                  className: "font-medium",
                  placement: "left",
                }}
                onClick={() => navigate("/new-character")}
                className="hover:shadow-glow"
              />
              <FloatButton
                icon={<UsergroupAddOutlined />}
                tooltip={{
                  title: "Create New Game",
                  className: "font-medium",
                  placement: "left",
                }}
                onClick={() => navigate("/new-game")}
                className="hover:shadow-glow"
              />
            </FloatButton.Group>
          )}
          {children}
        </Flex>
      </Layout.Content>

      <Layout.Footer
        data-testid="site-footer"
        className="relative z-10 backdrop-blur-xs bg-ship-gray bg-opacity-95 border-t border-sea-buckthorn border-opacity-20"
      >
        <PageFooter className={contentWidthClassName} />
      </Layout.Footer>
    </Layout>
  );
};

export default PageLayout;
