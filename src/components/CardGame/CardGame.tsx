import React from "react";
import { GameData } from "@/data/definitions";
import { Card, Descriptions, DescriptionsProps, Popconfirm } from "antd";
import { TeamOutlined, DeleteOutlined } from "@ant-design/icons";
import { useLocation } from "wouter";
import { User } from "firebase/auth";
import { deleteDocument } from "@/support/accountSupport";

interface CardGameProps {
  item: GameData;
  user: User | null;
}

const CardGame: React.FC<
  CardGameProps & React.ComponentPropsWithRef<"div">
> = ({ className, item, user }) => {
  const [, navigate] = useLocation();
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
            className="text-sea-buckthorn hover:text-california transition-all duration-300 hover:scale-110"
          />,
          <Popconfirm
            key="delete-confirm"
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
              aria-label="Delete game profile"
              title="Delete game profile"
              className="text-gray-500 hover:text-crimson-red transition-all duration-300 hover:scale-110"
            />
          </Popconfirm>,
        ]}
        className={`modern-card group ${className}`}
        styles={{
          body: { padding: "16px" },
          actions: {
            background:
              "linear-gradient(145deg, rgba(249, 179, 42, 0.1) 0%, rgba(253, 160, 13, 0.1) 100%)",
            borderTop: "1px solid rgba(249, 179, 42, 0.2)",
          },
        }}
      >
        <Card.Meta
          avatar={
            <div className="relative w-16 h-16 flex items-center justify-center bg-linear-to-br from-sea-buckthorn to-california rounded-full shadow-lg group-hover:animate-pulse">
              <TeamOutlined className="text-2xl text-ship-gray" />
            </div>
          }
          title={
            <div className="space-y-1">
              <span className="font-enchant text-2xl tracking-wider group-hover:animate-pulse">
                {item.name}
              </span>
              <div className="h-0.5 bg-linear-to-r from-sea-buckthorn to-california rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          }
          description={
            <div className="space-y-2">
              <Descriptions
                items={descriptionItems}
                size="small"
                column={1}
                className="[&_.ant-descriptions-item-label]:text-white [&_.ant-descriptions-item-label]:font-medium"
              />
            </div>
          }
        />
      </Card>
    )
  );
};

export default CardGame;
