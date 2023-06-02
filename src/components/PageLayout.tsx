import { Layout } from "antd";
import FooterContent from "./FooterContent";
import { Outlet } from "react-router-dom";
import HeaderContent from "./HeaderContent";
import { PageLayoutProps } from "./types";

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
        <Outlet />
      </Layout.Content>
      <Layout.Footer className="bg-shipGray">
        <FooterContent />
      </Layout.Footer>
    </Layout>
  );
}
