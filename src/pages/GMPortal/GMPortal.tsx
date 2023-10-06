import { UsergroupAddOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Row, Spin, Typography, message } from "antd";
import { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { auth, db } from "../../firebase";
import { GameData } from "../../data/definitions";
import classNames from "classnames";
import NewGameModal from "../../components/NewGameModal/NewGameModal";
import GameCard from "../../components/GameCard/GameCard";

const emptyGame: GameData = { name: "", id: "" };

export default function GMPortal({
  user,
  className,
}: { user: User | null } & React.ComponentPropsWithRef<"div">) {
  const outletContext = useOutletContext() as { className: string };
  const [games, setGames] = useState<GameData[]>([]);
  const [gameData, setGameData] = useState<GameData>(emptyGame);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const success = (name: string) => {
    messageApi.open({
      type: "success",
      content: `${name} successfully saved!`,
    });
  };

  const errorMessage = (message: string) => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
    });
  };

  async function addGameData(gameData: GameData) {
    // Check if a user is currently logged in
    if (auth.currentUser) {
      // Get the current user's UID
      const uid = auth.currentUser.uid;

      // Get a reference to the Firestore document
      const docRef = doc(collection(db, `users/${uid}/games`));

      // Set the game data for the current user
      try {
        await setDoc(docRef, gameData);
        success(gameData.name);
        // Reset gameData
        setGameData(emptyGame);
      } catch (error) {
        console.error("Error writing document: ", error);
        errorMessage(`Error writing document (see console)`);
      }
    } else {
      console.error("No user is currently logged in.");
      errorMessage(`No user is currently logged in.`);
    }
  }

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
              const data = doc.data() as GameData;
              data.id = doc.id;
              return data;
            });
            setGames(userGames);
            document.title = `CODEX.QUEST | Game List`;
            setLoading(false);
          });

          // Return the unsubscribe function to clean up the listener
          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    // Call the fetchGames function when the component mounts
    fetchGames();
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
      {contextHolder}
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
      ) : games.length > 0 ? (
        <Row justify={"start"} gutter={32} className="gap-y-9">
          {games
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((gameData) => {
              return (
                <Col xs={24} md={12} lg={6} key={gameData.id}>
                  <GameCard gameData={gameData} />
                </Col>
              );
            })}
        </Row>
      ) : (
        <Empty description="Create your first game by clicking the button above." />
      )}
      <NewGameModal
        isNewGameModalOpen={isNewGameModalOpen}
        handleCancel={handleCancel}
        addGameData={addGameData}
      />
    </div>
  );
}
