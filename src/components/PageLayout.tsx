import { Layout } from "antd";
import FooterContent from "./FooterContent";
import { Outlet } from "react-router-dom";
import HeaderContent from "./HeaderContent";
import { PageLayoutProps } from "./types";
import { Typography } from "antd";

export default function PageLayout({
  auth,
  handleLogin,
  onCharacterAdded,
  user,
}: PageLayoutProps) {
  return (
    <Layout>
      <Layout.Header className="bg-shipGray">
        <HeaderContent
          user={user}
          handleLogin={handleLogin}
          auth={auth}
          onCharacterAdded={onCharacterAdded}
        />
      </Layout.Header>
      <Layout.Content className="bg-springWood p-4">
        <Typography.Title level={1}>CODEX.QUEST</Typography.Title>
        <Outlet />
      </Layout.Content>
      <Layout.Footer className="bg-shipGray">
        <FooterContent />
      </Layout.Footer>
    </Layout>
  );
}
