import { Link, useNavigate } from "react-router-dom";
import { Button, Tooltip, Typography } from "antd";
import { HeaderContentProps } from "./definitions";
import {
  LogoutOutlined,
  ReconciliationOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import LoginSignupModal from "../../../modals/LoginSignupModal";
import { useState } from "react";
import { title } from "../../../../package.json";
import classNames from "classnames";

export default function HeaderContent({
  auth,
  handleLogin,
  user,
  className,
}: HeaderContentProps & React.ComponentPropsWithRef<"div">) {
  const navigate = useNavigate();
  const [isLoginSignupModalOpen, setIsLoginSignupModalOpen] = useState(false);
  const handleCancel = () => setIsLoginSignupModalOpen(false);
  const headerContentClassNames = classNames(
    "gap-y-2",
    "grid",
    "grid-cols-[1fr,auto]",
    "grid-rows-[auto,auto]",
    className
  );
  const buttonTextClassNames = classNames("hidden", "md:inline");
  return (
    <div className={headerContentClassNames}>
      <Typography.Title
        level={1}
        className="!mb-0 mt-0 text-4xl col-span-2 text-center"
      >
        <Link
          to="/"
          className="text-white/95 font-enchant tracking-wider text-5xl"
        >
          {title}
        </Link>
      </Typography.Title>
      {user && (
        <div className="flex flex-wrap gap-4">
          <Button type="primary" onClick={() => navigate(`/create`)}>
            <UserAddOutlined />
            <span className={buttonTextClassNames}>New Character</span>
          </Button>
          <Button type="primary" onClick={() => navigate(`/gm`)}>
            <ReconciliationOutlined />
            <span className={buttonTextClassNames}>GM Portal</span>
          </Button>
        </div>
      )}
      <>
        {user ? (
          <div className="flex gap-4 items-baseline justify-end">
            <Typography.Text className={buttonTextClassNames}>
              {user.displayName || user.email}
            </Typography.Text>
            <Tooltip title="Logout of CODEX.QUEST" color="#3E3643">
              <Button
                type="primary"
                shape="circle"
                icon={<LogoutOutlined />}
                onClick={() => auth.signOut()}
              />
            </Tooltip>
          </div>
        ) : (
          <Button
            type="primary"
            onClick={() => setIsLoginSignupModalOpen(true)}
          >
            Log in / Sign up
          </Button>
        )}
      </>
      <LoginSignupModal
        handleCancel={handleCancel}
        isLoginSignupModalOpen={isLoginSignupModalOpen}
        handleLogin={handleLogin}
      />
    </div>
  );
}
