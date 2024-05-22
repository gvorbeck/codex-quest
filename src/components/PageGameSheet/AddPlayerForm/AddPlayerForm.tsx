import { Button, Flex, Input, Space, Typography, message } from "antd";
import React from "react";
import { UserAddOutlined } from "@ant-design/icons";
import DOMPurify from "dompurify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GamePlayer } from "@/data/definitions";
import { db } from "@/firebase";
import { GameDataContext } from "@/store/GameDataContext";

async function updateGameWithNewPlayer(
  gameId: string,
  userId: string,
  newPlayer: GamePlayer,
) {
  const gameDocRef = doc(db, `users/${userId}/games/${gameId}`);
  const gameDoc = await getDoc(gameDocRef);

  if (gameDoc.exists()) {
    const gameData = gameDoc.data();
    const updatedPlayers = [...(gameData?.players || []), newPlayer];
    await setDoc(gameDocRef, { ...gameData, players: updatedPlayers });
  } else {
    console.error("Game does not exist");
  }
}

async function addPlayerToGame(url: string, gameId: string, gmId: string) {
  const sanitizedURL = DOMPurify.sanitize(url);
  const regex = /\/u\/([a-zA-Z0-9]+)\/c\/([a-zA-Z0-9]+)/;
  const match = sanitizedURL.match(regex);
  if (!match) {
    throw new Error("Invalid URL format.");
  }

  const userId = match[1];
  const characterId = match[2];
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("No such character exists.");
  }

  const characterData = { user: userId, character: characterId };
  await updateGameWithNewPlayer(gameId, gmId, characterData);
  return characterData;
}

const AddPlayerForm: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const [playerUrl, setPlayerUrl] = React.useState("");
  const { userIsOwner, gameId, userId } = React.useContext(GameDataContext);

  if (!gameId || !userId) {
    if (!gameId && !userId) {
      console.error("Game ID and User ID are missing.");
      return <div>Game ID and User ID are missing.</div>;
    }
    if (!gameId) {
      console.error("Game ID is missing.");
      return <div>Game ID is missing.</div>;
    }
    if (!userId) {
      console.error("User ID is missing.");
      return <div>User ID is missing.</div>;
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPlayerUrl(event.target.value);

  const onFinish = async () => {
    try {
      await addPlayerToGame(playerUrl, gameId, userId);
      message.success("Character added successfully.");
      setPlayerUrl("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  return (
    <Flex vertical className={className}>
      <Typography.Text type="secondary" className="text-xs ml-3">
        Enter a character's codex.quest URL
      </Typography.Text>
      <Space.Compact>
        <Input
          value={playerUrl}
          onChange={handleUrlChange}
          placeholder="http://codex.quest/u/AsxtzoU61db5IAA6d9IrEFFjh6a2/c/qK3N1Oe0JChp1iWLduqW"
          disabled={!userIsOwner}
          onPressEnter={onFinish}
        />
        <Button
          type="primary"
          className="shadow-none"
          icon={<UserAddOutlined />}
          onClick={onFinish}
          disabled={!userIsOwner}
        >
          Add Character
        </Button>
      </Space.Compact>
    </Flex>
  );
};

export default AddPlayerForm;
