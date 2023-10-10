import React from "react";
import { CharacterData } from "../../../data/definitions";

interface PlayerStatsProps {
  player: CharacterData;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  console.log("player", player);
  return <div>{player.name}</div>;
};

export default PlayerStats;
