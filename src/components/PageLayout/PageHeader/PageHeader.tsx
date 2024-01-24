import { User } from "firebase/auth";
import React from "react";
import { handleLogin } from "@/support/accountSupport";
import { title } from "../../../../package.json";
import DragonIcon from "@/assets/images/dragon-head.png";
import { Button, Flex, Tooltip, Typography } from "antd";
import classNames from "classnames";
import LoginSignupModal from "@/components/ModalLoginSignup/ModalLoginSignup";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { auth } from "@/firebase";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  user: User | null;
}

const PageHeader: React.FC<
  PageHeaderProps & React.ComponentPropsWithRef<"div">
> = ({ user, className }) => {
  const [isLoginSignupModalOpen, setIsLoginSignupModalOpen] =
    React.useState(false);
  const handleCancel = () => setIsLoginSignupModalOpen(false);

  const siteTitle = title.split(" ");

  const pageHeaderContainerClassNames = classNames(className);
  return (
    <Flex className={pageHeaderContainerClassNames} justify="space-between">
      <Typography.Title level={1} className="text-3xl/base m-0 h-auto flex">
        <Link
          to="/"
          className="font-enchant text-springWood flex items-center gap-2 leading-none [&>span]:mt-1.5 tracking-wider"
        >
          <span>{siteTitle[0]}</span>
          <img src={DragonIcon} className="w-10" alt="Dragon Icon" />
          <span>{siteTitle[1]}</span>
        </Link>
      </Typography.Title>
      <div>
        {user ? (
          <Tooltip title="Logout of CODEX.QUEST" color="#3E3643">
            <Button
              type="primary"
              shape="circle"
              icon={<LogoutOutlined />}
              onClick={() => auth.signOut()}
              className="shadow-none logout"
            />
          </Tooltip>
        ) : (
          <Tooltip title="Login to CODEX.QUEST" color="#3E3643">
            <Button
              type="primary"
              onClick={() => setIsLoginSignupModalOpen(true)}
              className="[&:hover]:text-shipGray shadow-none login"
              shape="circle"
              icon={<LoginOutlined />}
            />
          </Tooltip>
        )}
      </div>
      <LoginSignupModal
        handleCancel={handleCancel}
        isLoginSignupModalOpen={isLoginSignupModalOpen}
        handleLogin={handleLogin}
      />
    </Flex>
  );
};

export default PageHeader;
