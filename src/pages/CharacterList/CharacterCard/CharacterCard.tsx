import {
  DeleteOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Popconfirm } from "antd";
import { CharacterCardProps } from "./definitions";
import { useNavigate } from "react-router-dom";

export default function CharacterCard({
  characterData,
  user,
  image,
  confirm,
}: CharacterCardProps) {
  const navigate = useNavigate();
  return (
    <Card
      bodyStyle={{
        backgroundColor: "#e2e8f0",
        borderRadius: "0.5rem 0.5rem 0 0",
        border: "1px solid rgba(62,53,67, 0.15)",
        borderBottomWidth: "2px",
      }}
      actions={[
        <SolutionOutlined
          key="sheet"
          onClick={() => navigate(`/u/${user?.uid}/c/${characterData.id}`)}
          title="Go to Character Sheet"
          aria-label="Go to Character Sheet"
        />,
        <Popconfirm
          title="Delete this character?"
          description={`This cannot be undone!`}
          onConfirm={() => characterData?.id && confirm(characterData.id)}
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
      className="h-full flex flex-col justify-between [&>ul]:border-t-solid [&>ul]:border-t-2 [&>ul]:border-[rgba(0,0,0,0.1)]"
    >
      <Card.Meta
        description={
          <div className="flex flex-col items-center text-slate-600">
            <span>Level {characterData.level}</span>
            <span>{characterData.race}</span>
            <span>{characterData.class}</span>
          </div>
        }
        className="flex-col [&>.ant-card-meta-avatar]:self-center [&>.ant-card-meta-avatar]:pr-0 [&>.ant-card-meta-avatar]:mb-2 [&>.ant-card-meta-avatar]:text-springWood"
        avatar={
          characterData.avatar ? (
            <Avatar
              size={64}
              src={image}
              alt={characterData.name}
              className="shadow-md border-solid border-2 border-seaBuckthorn"
            />
          ) : (
            <Avatar
              size={64}
              icon={<UserOutlined />}
              alt={characterData.name}
              className="shadow-md border-solid border-2 border-seaBuckthorn"
            />
          )
        }
        title={<span className="text-center block">{characterData.name}</span>}
      />
    </Card>
  );
}
