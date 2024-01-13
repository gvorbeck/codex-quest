import React from "react";
import { GameData } from "@/data/definitions";
import { Card, Descriptions, DescriptionsProps, Popconfirm } from "antd";
import { TeamOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { deleteDocument } from "@/support/accountSupport";

interface CardGameProps {
  item: GameData;
  user: User | null;
}

const CardGame: React.FC<
  CardGameProps & React.ComponentPropsWithRef<"div">
> = ({ className, item, user }) => {
  const navigate = useNavigate();
  if (!item) {
    return null; // or a placeholder/loading/error state
  }

  const descriptionItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Players",
      children: item.players ? item.players.length : 0,
    },
  ];
  return (
    item &&
    user && (
      <Card
        actions={[
          <TeamOutlined
            key="sheet"
            onClick={() => navigate(`/u/${user?.uid}/g/${item.id}`)}
            title="Go to game profile"
            aria-label="Go to game profile"
          />,
          <Popconfirm
            title="Delete this game profile?"
            description={`This cannot be undone!`}
            onConfirm={() =>
              deleteDocument({
                collection: "games",
                docId: item.id!,
                uid: user?.uid,
              })
            }
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              key="delete"
              aria-label="Delete game profile"
              title="Delete game profile"
            />
          </Popconfirm>,
        ]}
        className={className}
      >
        <Card.Meta
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

export default CardGame;
