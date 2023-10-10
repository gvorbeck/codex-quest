import React, { useEffect } from "react";
import { CharacterData } from "../../../data/definitions";
import PlayerStats from "../PlayerStats/PlayerStats";
import AddPlayerForm from "../AddPlayerForm/AddPlayerForm";

interface PlayerListProps {
  players: CharacterData[];
  setPlayers: (players: CharacterData[]) => void;
  gameId: string;
  userId: string;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  setPlayers,
  gameId,
  userId,
}) => {
  return (
    <div className="bg-black bg-opacity-10 rounded">
      <div>
        {players?.map((player: CharacterData) => (
          <PlayerStats player={player} key={player.name} />
        ))}
      </div>
      <AddPlayerForm
        setPlayers={setPlayers}
        players={players}
        gameId={gameId}
        gmId={userId}
      />
    </div>
  );
};

export default PlayerList;
