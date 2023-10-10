import { User } from "firebase/auth";
import { useParams } from "react-router-dom";
import PlayerList from "../../components/GameSheet/PlayerList/PlayerList";
import Clipboard from "../../components/GameSheet/Clipboard/Clipboard";
import classNames from "classnames";
import { Skeleton, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { GameData } from "../../data/definitions";

type GameSheetProps = { user: User | null };

export default function GameSheet({ user }: GameSheetProps) {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [players, setPlayers] = useState<GameData["players"]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setPlayers(gameData?.players || []);
  }, [gameData]);

  const { uid, id } = useParams();

  const gameSheetClassNames = classNames(
    "flex",
    "flex-col",
    "lg:flex-row",
    "gap-4",
    "[&>div]:flex-[1_0_0%]",
    "[&>div]:p-4"
  );

  // GET GameDATA
  useEffect(() => {
    const gameDocRef = doc(db, `users/${uid}/games/${id}`);

    // Listen to real-time updates
    const unsubscribe = onSnapshot(gameDocRef, (snapshot) => {
      if (snapshot.exists()) {
        let gameData = snapshot.data() as GameData;
        setGameData(gameData);
        document.title = `${gameData.name} | CODEX.QUEST`;
      } else {
        console.error("Game not found");
      }
    });

    // Return the unsubscribe function to clean up the listener
    return () => unsubscribe();
  }, [uid, id]);

  return (
    <div>
      {contextHolder}
      <div>
        <Typography.Title level={2}>
          {gameData ? gameData.name : <Skeleton title paragraph={false} />}
        </Typography.Title>
      </div>
      <div className={gameSheetClassNames}>
        {gameData && id && uid ? (
          <PlayerList
            players={players}
            setPlayers={setPlayers}
            gameId={id}
            userId={uid}
          />
        ) : (
          <Skeleton />
        )}
        {gameData ? <Clipboard /> : <Skeleton />}
      </div>
    </div>
  );
}
