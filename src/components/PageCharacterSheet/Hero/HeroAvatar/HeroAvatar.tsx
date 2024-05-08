import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import { CharData } from "@/data/definitions";
import { getAvatar } from "@/support/characterSupport";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";
import classNames from "classnames";
import React from "react";

interface HeroAvatarProps {
  userIsOwner: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  setModalTitle: (modalTitle: string) => void;
  setModalContent: (modalContent: React.ReactNode) => void;
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const HeroAvatar: React.FC<
  HeroAvatarProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  userIsOwner,
  setModalIsOpen,
  setModalTitle,
  setModalContent,
  character,
  setCharacter,
}) => {
  const wrapperClassNames = classNames(
    "[&>span:hover>span:last-child]:opacity-100 mx-auto cursor-pointer",
    className,
  );

  const showAvatarModal = () => {
    setModalIsOpen(true);
    setModalTitle("Change Avatar");
    setModalContent(
      <AvatarPicker character={character} setCharacter={setCharacter} />,
    );
  };
  return (
    <div
      className={wrapperClassNames}
      onClick={
        userIsOwner
          ? showAvatarModal
          : () => {
              console.error(
                "You are not logged in as the owner of this character",
              );
            }
      }
    >
      <Badge count={<EditOutlined className="opacity-25" />}>
        <Avatar
          size={64}
          className="avatar"
          icon={!character.avatar ? <UserOutlined /> : undefined}
          src={character.avatar ? getAvatar(character.avatar) : undefined}
        />
      </Badge>
    </div>
  );
};

export default HeroAvatar;
