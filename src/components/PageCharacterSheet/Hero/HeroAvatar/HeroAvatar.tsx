import { CharacterDataContext } from "@/store/CharacterContext";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";
import React from "react";

interface HeroAvatarProps {
  handleShowAvatarModal: () => void;
}

const HeroAvatar: React.FC<
  HeroAvatarProps & React.ComponentPropsWithRef<"div">
> = ({ className, handleShowAvatarModal }) => {
  const { character } = React.useContext(CharacterDataContext);
  const icon = !character.avatar ? <UserOutlined /> : undefined;
  const src = character.avatar ?? undefined;

  return (
    <div
      className={
        "[&>span:hover>span:last-child]:opacity-100 mx-auto cursor-pointer " +
        className
      }
      onClick={handleShowAvatarModal}
    >
      <Badge count={<EditOutlined className="opacity-25" />}>
        <Avatar size={64} className="avatar" icon={icon} src={src} />
      </Badge>
    </div>
  );
};

export default HeroAvatar;
