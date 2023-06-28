import { Layout } from "antd";
import FooterContent from "./FooterContent/FooterContent";
import { Outlet } from "react-router-dom";
import HeaderContent from "./HeaderContent/HeaderContent";
import { PageLayoutProps } from "./definitions";

export default function PageLayout({
  auth,
  handleLogin,
  onCharacterAdded,
  user,
}: PageLayoutProps) {
  return (
    <Layout>
      <Layout.Header className="bg-shipGray px-8 py-4 h-auto flex-[0_1_auto]">
        <HeaderContent
          user={user}
          handleLogin={handleLogin}
          auth={auth}
          onCharacterAdded={onCharacterAdded}
          className="max-w-[1200px] m-auto"
        />
      </Layout.Header>
      <Layout.Content className="bg-springWood p-8 flex-[1_1_auto] inline-table">
        <Outlet context={{ user, className: "max-w-[1200px] m-auto" }} />
      </Layout.Content>
      <Layout.Footer className="bg-shipGray p-8 flex-[0_1_auto]">
        <FooterContent className="max-w-[1200px] m-auto" />
      </Layout.Footer>
    </Layout>
  );
}
