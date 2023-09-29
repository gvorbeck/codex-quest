import { Layout } from "antd";
import FooterContent from "./FooterContent/FooterContent";
import { Outlet } from "react-router-dom";
import HeaderContent from "./HeaderContent/HeaderContent";
import { PageLayoutProps } from "./definitions";
import classNames from "classnames";

export default function PageLayout({
  auth,
  handleLogin,
  user,
}: PageLayoutProps) {
  const headerClassNames = classNames(
    "bg-shipGray",
    "px-4",
    "py-4",
    "h-auto",
    "flex-[0_1_auto]",
    "lg:px-8",
    "print:hidden"
  );
  const contentClassNames = classNames(
    "bg-springWood",
    "p-4",
    "flex-[1_1_auto]",
    "inline-table",
    "lg:p-8",
    "print:p-0"
  );
  const footerClassNames = classNames(
    "bg-shipGray",
    "p-8",
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
          className="max-w-[1200px]"
        />
      </Layout.Header>
      <Layout.Content className={contentClassNames}>
        <Outlet context={{ user, className: "max-w-[1200px] m-auto" }} />
      </Layout.Content>
      <Layout.Footer className={footerClassNames}>
        <FooterContent className="max-w-[1200px] m-auto" />
      </Layout.Footer>
    </Layout>
  );
}
