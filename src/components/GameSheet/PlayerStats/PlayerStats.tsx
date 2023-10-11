import React from "react";
import { CharacterData } from "../../../data/definitions";

interface PlayerStatsProps {
  player: CharacterData | undefined;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  return <>{player && <div>{player.name}</div>}</>;
};

export default PlayerStats;
