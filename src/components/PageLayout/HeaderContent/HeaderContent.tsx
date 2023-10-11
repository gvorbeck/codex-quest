import { Link } from "react-router-dom";
import { Button, Switch, Tooltip, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import LoginSignupModal from "../../../modals/LoginSignupModal";
import { useState } from "react";
import { title } from "../../../../package.json";
import classNames from "classnames";
import DragonIcon from "../../../assets/images/spiked-dragon-head.png";
import { Auth, User } from "firebase/auth";
import { MODE, ModeType } from "../../../data/definitions";

type HeaderContentProps = {
  user: User | null;
  handleLogin: () => Promise<void>;
  auth: Auth;
  mode: ModeType;
  setMode: (mode: ModeType) => void;
};

export default function HeaderContent({
  auth,
  handleLogin,
  user,
  className,
  mode,
  setMode,
}: HeaderContentProps & React.ComponentPropsWithRef<"div">) {
  const [isLoginSignupModalOpen, setIsLoginSignupModalOpen] = useState(false);

  const handleCancel = () => setIsLoginSignupModalOpen(false);
  const handleModeSwitchChange = (checked: boolean) => {
    if (checked) {
      setMode(MODE.PLAYER);
    } else {
      setMode(MODE.GM);
    }
  };

  const headerContentClassNames = classNames(
    "gap-y-2",
    "grid",
    "grid-cols-[1fr,auto]",
    "grid-rows-[auto,auto]",
    className
  );
  const buttonTextClassNames = classNames("hidden", "md:inline");
  const titleClassNames = classNames(
    "text-white/95",
    "font-enchant",
    "tracking-wider",
    "text-4xl",
    "md:text-5xl",
    "flex",
    "margin-x-auto",
    "gap-2",
    "justify-center",
    "items-center"
  );

  const displayTitle = title.split(" ");
  return (
    <div className={headerContentClassNames}>
      <Typography.Title level={1} className="!mb-0 mt-0 col-span-2 text-center">
        <Link to="/" className={titleClassNames}>
          <span>{displayTitle[0]}</span>
          <img src={DragonIcon} className="w-12 h-12" alt="Dragon Icon" />
          <span>{displayTitle[1]}</span>
        </Link>
      </Typography.Title>
      {user && (
        <div className="flex flex-wrap gap-4">
          <Switch
            className="self-center"
            checked={mode === MODE.PLAYER}
            onChange={handleModeSwitchChange}
            checkedChildren={MODE.PLAYER}
            unCheckedChildren={
              <span className="text-springWood">{MODE.GM}</span>
            }
            defaultChecked
          />
          {/* <Button type="primary" onClick={() => navigate(`/create`)}>
            <UserAddOutlined />
            <span className={buttonTextClassNames}>New Character</span>
          </Button>
          <Button type="primary" onClick={() => navigate(`/gm`)}>
            <ReconciliationOutlined />
            <span className={buttonTextClassNames}>GM Portal</span>
          </Button> */}
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
