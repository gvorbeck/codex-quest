import { Button, Flex, Input } from "antd";
import React from "react";
import { mobileBreakpoint } from "@/support/stringSupport";
import { useMediaQuery } from "react-responsive";
import { debounce, updateDocument } from "@/support/accountSupport";
import { LoadingOutlined } from "@ant-design/icons";

interface NotesProps {
  uid: string;
  gameId: string;
  notes?: string;
}

const Notes: React.FC<NotesProps & React.ComponentPropsWithRef<"div">> = ({
  className,
  uid,
  gameId,
  notes,
}) => {
  const isMobile = useMediaQuery({ query: mobileBreakpoint });
  const [gameNotes, setGameNotes] = React.useState<string>(notes || "");
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  // Debounce function to save notes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveNotes = React.useCallback(
    debounce(async (newNotes: string) => {
      setIsSaving(true);
      await updateDocument({
        collection: "users", // for example
        docId: uid,
        subCollection: "games",
        subDocId: gameId,
        data: { notes: newNotes },
      });
      setIsSaving(false);
    }, 3000),
    [gameId],
  );

  React.useEffect(() => {
    const handler = setTimeout(() => saveNotes(gameNotes), 3000);

    return () => {
      clearTimeout(handler);
    };
  }, [gameNotes, saveNotes]);

  return (
    <Flex vertical gap={16} justify="flex-end">
      <Input.TextArea
        className={className}
        value={gameNotes}
        rows={isMobile ? 4 : 20}
        onChange={(e) => setGameNotes(e.target.value)}
      />
      <Button
        icon={isSaving && <LoadingOutlined />}
        disabled={isSaving}
        type="primary"
      >
        Save
      </Button>
    </Flex>
  );
};

export default Notes;
