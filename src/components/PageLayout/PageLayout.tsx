import { Alert, Layout } from "antd";
import FooterContent from "./FooterContent/FooterContent";
import { Outlet } from "react-router-dom";
import HeaderContent from "./HeaderContent/HeaderContent";
import { PageLayoutProps } from "./definitions";

export default function PageLayout({
  auth,
  handleLogin,
  user,
}: PageLayoutProps) {
  return (
    <Layout>
      <Layout.Header className="bg-shipGray px-8 py-4 h-auto flex-[0_1_auto] print:hidden">
        <HeaderContent
          user={user}
          handleLogin={handleLogin}
          auth={auth}
          className="max-w-[1200px] m-auto"
        />
      </Layout.Header>
      <Alert
        type="info"
        message="Codex.Quest v2.0 coming in December with many new features and upgrades."
        // className="mt-4 mx-4"
        banner
        closable
      />
      <Layout.Content className="bg-springWood p-8 print:p-0 flex-[1_1_auto] inline-table">
        <Outlet context={{ user, className: "max-w-[1200px] m-auto" }} />
      </Layout.Content>
      <Layout.Footer className="bg-shipGray p-8 flex-[0_1_auto] print:hidden">
        <FooterContent className="max-w-[1200px] m-auto" />
      </Layout.Footer>
    </Layout>
  );
}
