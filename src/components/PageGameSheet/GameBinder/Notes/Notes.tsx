import { Button, Flex, Input } from "antd";
import React from "react";
import { mobileBreakpoint } from "@/support/stringSupport";
import { useMediaQuery } from "react-responsive";
import { updateDocument } from "@/support/accountSupport";
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

  const saveNotes = React.useCallback(
    async (newNotes: string) => {
      setIsSaving(true);
      await updateDocument({
        collection: "users",
        docId: uid,
        subCollection: "games",
        subDocId: gameId,
        data: { notes: newNotes },
      });
      setIsSaving(false);
    },
    [uid, gameId],
  );

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (gameNotes !== notes) {
        saveNotes(gameNotes);
        // Display a confirmation dialog to the user
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [gameNotes, notes, saveNotes]);

  return (
    <Flex vertical gap={16} justify="flex-end">
      <Input.TextArea
        className={className}
        value={gameNotes}
        rows={isMobile ? 4 : 20}
        onChange={(e) => setGameNotes(e.target.value)}
        onBlur={() => saveNotes(gameNotes)}
      />
      <Button
        icon={isSaving && <LoadingOutlined />}
        disabled={isSaving}
        type="primary"
        onClick={() => saveNotes(gameNotes)}
      >
        Save
      </Button>
    </Flex>
  );
};

export default Notes;
