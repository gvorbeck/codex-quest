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
      <Layout.Header>
        <HeaderContent
          user={user}
          handleLogin={handleLogin}
          auth={auth}
          onCharacterAdded={onCharacterAdded}
        />
      </Layout.Header>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
      <Layout.Footer>
        <FooterContent />
      </Layout.Footer>
    </Layout>
  );
}
