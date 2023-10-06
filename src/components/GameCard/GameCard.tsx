import React from "react";
import { GameData } from "../../data/definitions";

interface GameCardProps {
  gameData: GameData;
}

const GameCard: React.FC<GameCardProps> = ({ gameData }) => {
  return <div>{gameData.name}</div>;
};

export default GameCard;
