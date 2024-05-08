import React from "react";
import { CharData } from "@/data/definitions";
import {
  Avatar,
  Card,
  Descriptions,
  DescriptionsProps,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
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

  const descriptionItems: DescriptionsProps["items"] = [
    { key: "1", label: "Level", children: item.level },
    { key: "2", label: "Race", children: item.race },
    { key: "3", label: "Class", children: item.class.join(" | ") },
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
              src={item.avatar || undefined}
              icon={!item.avatar ? <UserOutlined /> : undefined}
              size={64}
              className="avatar"
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
