import { User } from "firebase/auth";
import React from "react";
import { handleLogin } from "@/support/accountSupport";
import { title } from "../../../../package.json";
import DragonIcon from "@/assets/images/dragon-head.png";
import { Button, Flex, Tooltip, Typography } from "antd";
import ModalLoginSignup from "@/components/ModalLoginSignup/ModalLoginSignup";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { auth } from "@/firebase";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeSwitcher/ThemeSwitcher";

interface PageHeaderProps {
  user: User | null;
}

const PageHeader: React.FC<
  PageHeaderProps & React.ComponentPropsWithRef<"div">
> = ({ user, className }) => {
  const [isLoginSignupModalOpen, setIsLoginSignupModalOpen] =
    React.useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const handleCancel = () => setIsLoginSignupModalOpen(false);

  const siteTitle = title.split(" ");

  return (
    <Flex className={className} justify="space-between">
      <Typography.Title
        level={1}
        className="text-3xl/base m-0 h-auto flex"
        data-testid="site-title"
      >
        <Link
          to="/"
          className="font-enchant text-springWood flex items-center gap-2 leading-none [&>span]:mt-1.5 [&>span]:italic [&>span]:opacity-90 tracking-wider"
          data-testid="home-link"
        >
          <span>{siteTitle[0]}</span>
          <img src={DragonIcon} className="w-10" alt="Dragon Icon" />
          <span>{siteTitle[1]}</span>
        </Link>
      </Typography.Title>
      <Button onClick={toggleTheme}>
        Switch to {isDarkMode ? "Light" : "Dark"} Mode
      </Button>
      <div>
        {user ? (
          <Tooltip title="Logout of CODEX.QUEST" color="#3E3643">
            <Button
              type="primary"
              shape="circle"
              className="shadow-none"
              icon={<LogoutOutlined />}
              data-testid="logout-button"
              onClick={() => auth.signOut()}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Login to CODEX.QUEST" color="#3E3643">
            <Button
              type="primary"
              shape="circle"
              icon={<LoginOutlined />}
              data-testid="login-button"
              onClick={() => setIsLoginSignupModalOpen(true)}
              className="[&:hover]:text-shipGray shadow-none"
            />
          </Tooltip>
        )}
      </div>
      <ModalLoginSignup
        handleCancel={handleCancel}
        isLoginSignupModalOpen={isLoginSignupModalOpen}
        handleLogin={handleLogin}
      />
    </Flex>
  );
};

export default PageHeader;
