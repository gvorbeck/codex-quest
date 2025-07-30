import { User } from "firebase/auth";
import React from "react";
import { handleLogin } from "@/support/accountSupport";
import { title } from "../../../../package.json";
import DragonIcon from "@/assets/images/dragon-head.webp";
import { Button, Flex, Tooltip, Typography } from "antd";
import ModalLoginSignup from "@/components/ModalLoginSignup/ModalLoginSignup";
import {
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { auth } from "@/firebase";
import { Link } from "wouter";
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
    <Flex className={className} justify="space-between" align="center">
      <Typography.Title
        level={1}
        className="text-3xl/base m-0 h-auto flex group"
        data-testid="site-title"
      >
        <Link
          to="/"
          className="font-enchant text-springWood flex items-center gap-3 leading-none tracking-wider transition-all duration-300 hover:scale-105"
          data-testid="home-link"
        >
          <span className="relative">
            <span className="group-hover:animate-pulse">{siteTitle[0]}</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-seaBuckthorn to-california transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </span>

          <div className="relative">
            <img
              src={DragonIcon}
              className="w-10 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
              alt="Dragon Icon"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-seaBuckthorn to-california rounded-full opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
          </div>

          <span className="relative">
            <span className="group-hover:animate-pulse">{siteTitle[1]}</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-seaBuckthorn to-california transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </span>
        </Link>
      </Typography.Title>

      <Flex gap={12} align="center">
        <Tooltip title="Change Theme" placement="bottom">
          <Button
            onClick={toggleTheme}
            icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
            shape="circle"
            className="btn-glow border-2 border-seaBuckthorn hover:border-california hover:shadow-glow "
            size="large"
          />
        </Tooltip>

        {user ? (
          <Tooltip
            title="Logout of CODEX.QUEST"
            color="#3E3643"
            placement="bottom"
          >
            <Button
              type="primary"
              shape="circle"
              size="large"
              className="shadow-glow btn-glow border-2 border-seaBuckthorn hover:border-california transition-all duration-300 hover:scale-105"
              icon={<LogoutOutlined />}
              data-testid="logout-button"
              onClick={() => auth.signOut()}
            />
          </Tooltip>
        ) : (
          <Tooltip
            title="Login to CODEX.QUEST"
            color="#3E3643"
            placement="bottom"
          >
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<LoginOutlined />}
              data-testid="login-button"
              onClick={() => setIsLoginSignupModalOpen(true)}
              className="shadow-glow btn-glow border-2 border-seaBuckthorn hover:border-california transition-all duration-300 hover:scale-105"
            />
          </Tooltip>
        )}
      </Flex>

      <ModalLoginSignup
        handleCancel={handleCancel}
        isLoginSignupModalOpen={isLoginSignupModalOpen}
        handleLogin={handleLogin}
      />
    </Flex>
  );
};

export default PageHeader;
