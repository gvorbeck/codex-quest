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
      <Layout.Header className="bg-shipGray px-8 py-4 h-auto">
        <HeaderContent
          user={user}
          handleLogin={handleLogin}
          auth={auth}
          onCharacterAdded={onCharacterAdded}
        />
      </Layout.Header>
      <Layout.Content className="bg-springWood p-8">
        <Outlet context={user} />
      </Layout.Content>
      <Layout.Footer className="bg-shipGray p-8">
        <FooterContent />
      </Layout.Footer>
    </Layout>
  );
}
