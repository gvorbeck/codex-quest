import { UsergroupAddOutlined } from "@ant-design/icons";
import { Button, Spin, Typography } from "antd";
import { User } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { db } from "../../firebase";
import { GamesData } from "../../data/definitions";
import classNames from "classnames";
import NewGameModal from "../../components/NewGameModal/NewGameModal";

export default function GMPortal({
  user,
  className,
}: { user: User | null } & React.ComponentPropsWithRef<"div">) {
  const outletContext = useOutletContext() as { className: string };
  const [games, setGames] = useState<GamesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState<boolean>(false);

  const handleCancel = () => {
    setIsNewGameModalOpen(false);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        if (user) {
          const uid = user.uid;
          const gamesCollectionRef = collection(db, `users/${uid}/games`);

          // Listen to real-time updates
          const unsubscribe = onSnapshot(gamesCollectionRef, (snapshot) => {
            const userGames = snapshot.docs.map((doc) => {
              const data = doc.data() as GamesData;
              data.id = doc.id;
              return data;
            });
            setGames(userGames);
            document.title = `CODEX.QUEST | Game List`;
            setLoading(false);
          });
        }
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };
  }, [user]);

  const confirm = async (gameId: string) => {
    if (user) {
      const gameDoc = doc(db, `users/${user.uid}/games/${gameId}`);
      await deleteDoc(gameDoc);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [games]);

  const gameListClassNames = classNames(
    outletContext.className,
    className,
    "text-shipGray",
    "[&>*+*]:mt-4"
  );
  return (
    <div className={gameListClassNames}>
      <div className="flex gap-4 items-center">
        <Typography.Title
          level={2}
          className="m-0 font-enchant text-5xl tracking-wider text-shipGray"
        >
          GM Portal
        </Typography.Title>
        <Button
          type="primary"
          icon={<UsergroupAddOutlined />}
          onClick={() => setIsNewGameModalOpen(true)}
        >
          New Game
        </Button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <div>
          {/*}
        <PlayerList />
        <AddPlayer />
        */}
          <NewGameModal
            isNewGameModalOpen={isNewGameModalOpen}
            handleCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}
