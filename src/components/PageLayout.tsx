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
  console.log("user", user);
  return (
    <Layout>
      <Layout.Header className="bg-shipGray px-8">
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
