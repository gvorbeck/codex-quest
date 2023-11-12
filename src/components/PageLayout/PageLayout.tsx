import { Alert, Layout } from "antd";
import FooterContent from "./FooterContent/FooterContent";
import { Outlet } from "react-router-dom";
import HeaderContent from "./HeaderContent/HeaderContent";
import classNames from "classnames";
import { User, Auth } from "firebase/auth";
import { ModeType } from "../../data/definitions";

type PageLayoutProps = {
  user: User | null;
  handleLogin: () => Promise<void>;
  auth: Auth;
  mode: ModeType;
  setMode: (mode: ModeType) => void;
};

export default function PageLayout({
  auth,
  handleLogin,
  user,
  mode,
  setMode,
}: PageLayoutProps) {
  const headerClassNames = classNames(
    "bg-shipGray",
    "p-4",
    "md:p-6",
    "h-auto",
    "flex-[0_1_auto]",
    "lg:px-8",
    "print:hidden"
  );
  const contentClassNames = classNames(
    "bg-springWood",
    "p-4",
    "md:p-6",
    "flex-[1_1_auto]",
    "inline-table",
    "lg:p-8",
    "print:p-0"
  );
  const footerClassNames = classNames(
    "bg-shipGray",
    "p-4",
    "md:p-6",
    "flex-[0_1_auto]",
    "print:hidden"
  );
  return (
    <Layout>
      <Layout.Header className={headerClassNames}>
        <HeaderContent
          user={user}
          handleLogin={handleLogin}
          auth={auth}
          className="max-w-[1200px] mx-auto"
          mode={mode}
          setMode={setMode}
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
      <Layout.Footer className={footerClassNames}>
        <FooterContent className="max-w-[1200px] mx-auto" />
      </Layout.Footer>
    </Layout>
  );
}
