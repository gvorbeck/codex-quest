import React from "react";
import { GameData } from "../../data/definitions";
import { Card, Popconfirm } from "antd";
import { DeleteOutlined, SolutionOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";

interface GameCardProps {
  gameData: GameData;
  user: User | null;
  confirm: (gameId: string) => Promise<void>;
}

const commonCardStyles = {
  backgroundColor: "#e2e8f0",
  border: "1px solid rgba(62,53,67, 0.15)",
  borderBottomWidth: "2px",
};

const GameCard: React.FC<GameCardProps> = ({ gameData, user }) => {
  const navigate = useNavigate();
  return (
    <Card
      title={
        <span className="text-center font-enchant text-2xl/[3rem] tracking-wide text-shipGray">
          {gameData.name}
        </span>
      }
      headStyle={{
        ...commonCardStyles,
        borderRadius: "0.5rem 0.5rem 0 0",
      }}
      bodyStyle={{
        ...commonCardStyles,
        borderTop: "none",
        borderBottom: "none",
        borderRadius: "0",
      }}
      actions={[
        <SolutionOutlined
          key="sheet"
          onClick={() => navigate(`/u/${user?.uid}/g/${gameData.id}`)}
          title="Go to GM Screen"
          aria-label="Go to GM Screen"
        />,
        <Popconfirm
          title="Delete this game?"
          description={`This cannot be undone!`}
          onConfirm={() => gameData?.id && confirm(gameData.id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined
            key="delete"
            aria-label="Delete game"
            title="Delete game"
          />
        </Popconfirm>,
      ]}
    >
      Players: {gameData.players?.length || 0}
    </Card>
  );
};

export default GameCard;
