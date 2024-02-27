import { Button, Flex, Input, Space, Typography, message } from "antd";
import React from "react";
import { addPlayerToGame } from "@/support/accountSupport";
import { UserAddOutlined } from "@ant-design/icons";

interface AddPlayerFormProps {
  gmId: string;
  gameId: string;
  userIsOwner: boolean;
}

const AddPlayerForm: React.FC<
  AddPlayerFormProps & React.ComponentPropsWithRef<"div">
> = ({ className, gmId, gameId, userIsOwner }) => {
  const [playerUrl, setPlayerUrl] = React.useState("");

  const handleUrlChange = (value: string) => setPlayerUrl(value);

  const onFinish = async () => {
    try {
      await addPlayerToGame(playerUrl, gameId, gmId);
      // Handle additional UI logic like resetting form, updating local state, etc.
      message.success("Character added successfully.");
      setPlayerUrl("");
      // If you maintain a local state of players, update it here
      // setPlayers([...players, characterData]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.message);
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
          onChange={(e) => handleUrlChange(e.target.value)}
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
