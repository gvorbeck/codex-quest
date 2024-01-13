import React from "react";
import { CharData } from "@/data/definitions";
import {
  Avatar,
  Card,
  Descriptions,
  DescriptionsProps,
  Popconfirm,
} from "antd";
import { extractImageName } from "@/support/characterSupport";
import { images } from "@/assets/images/faces/imageAssets";
import {
  DeleteOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { avatarClassNames } from "@/support/classNameSupport";
import { deleteDocument } from "@/support/accountSupport";

interface CardCharacterProps {
  item: CharData;
  user: User | null;
}

const CardCharacter: React.FC<
  CardCharacterProps & React.ComponentPropsWithRef<"div">
> = ({ className, item, user }) => {
  const navigate = useNavigate();

  if (!item) {
    return null; // or a placeholder/loading/error state
  }
  // Legacy characters created while the site was using Create React App will have broken image links that start with "/static/media/"
  // This code checks for that and replaces the broken link with the correct one
  let image = "";
  if (item?.avatar?.startsWith("/static/media/")) {
    const legacyImage = extractImageName(item.avatar);
    if (legacyImage) {
      // find the matching source images in `images`
      // "/src/assets/images/faces/gnome-boy-1.jpg" matches gnome-boy-1
      image = images.find((image) => image.includes(legacyImage)) || "";
    }
  } else {
    image = item.avatar;
  }

  const descriptionItems: DescriptionsProps["items"] = [
    { key: "1", label: "Level", children: item.level },
    { key: "2", label: "Race", children: item.race },
    { key: "3", label: "Class", children: item.class },
  ];
  return (
    item &&
    user && (
      <Card
        actions={[
          <SolutionOutlined
            key="sheet"
            onClick={() => navigate(`/u/${user?.uid}/c/${item.id}`)}
            title="Go to Character Sheet"
            aria-label="Go to Character Sheet"
          />,
          <Popconfirm
            title="Delete this character?"
            description={`This cannot be undone!`}
            onConfirm={() =>
              deleteDocument({
                collection: "characters",
                docId: item.id!,
                uid: user?.uid,
              })
            }
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              key="delete"
              aria-label="Delete character"
              title="Delete character"
            />
          </Popconfirm>,
        ]}
        className={className}
      >
        <Card.Meta
          avatar={
            <Avatar
              src={image || undefined}
              icon={!image ? <UserOutlined /> : undefined}
              size={64}
              className={avatarClassNames}
            />
          }
          title={
            <span className="font-enchant text-2xl tracking-wider">
              {item.name}
            </span>
          }
          description={
            <Descriptions items={descriptionItems} size="small" column={1} />
          }
        />
      </Card>
    )
  );
};

export default CardCharacter;
