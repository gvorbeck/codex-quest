import React, { useEffect, useState } from "react";
import { CharacterData, PlayerListObject } from "../../../data/definitions";
import PlayerStats from "../PlayerStats/PlayerStats";
import AddPlayerForm from "../AddPlayerForm/AddPlayerForm";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { get } from "http";

type PlayerListProps = {
  players: PlayerListObject[];
  setPlayers: (players: PlayerListObject[]) => void;
  gameId: string;
  userId: string;
};

const getCharacterData = async (userId: string, characterId: string) => {
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as CharacterData;
  } else {
    console.error("No such document!");
  }
};

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  setPlayers,
  gameId,
  userId,
}) => {
  const [characterDataList, setCharacterDataList] = useState<CharacterData[]>(
    []
  );

  useEffect(() => {
    const fetchAllCharacterData = async () => {
      const fetchedData: CharacterData[] = [];
      for (const player of players) {
        const data = await getCharacterData(player.user, player.character);
        if (data) {
          fetchedData.push(data);
        }
      }
      setCharacterDataList(fetchedData);
    };

    fetchAllCharacterData();
  }, [players]);

  return (
    <div className="bg-black bg-opacity-10 rounded">
      <div className="flex-col gap-4 flex mb-4">
        {characterDataList.map((characterData, index) => (
          <PlayerStats
            player={characterData}
            key={players[index].character}
            userId={players[index].user}
            characterId={players[index].character}
          />
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
