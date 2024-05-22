import { Flex, Input } from "antd";
import React from "react";
import { mobileBreakpoint } from "@/support/stringSupport";
import { useMediaQuery } from "react-responsive";
import { updateDocument } from "@/support/accountSupport";

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
  const [initialNotes, setInitialNotes] = React.useState<string>(notes || "");
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const saveNotes = React.useCallback(
    async (newNotes: string) => {
      if (newNotes !== initialNotes) {
        setIsSaving(true);
        await updateDocument({
          collection: "users",
          docId: uid,
          subCollection: "games",
          subDocId: gameId,
          data: { notes: newNotes },
        });
        setInitialNotes(newNotes);
        setIsSaving(false);
      }
    },
    [initialNotes, uid, gameId],
  );

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (gameNotes !== initialNotes) {
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
  }, [gameNotes, initialNotes, saveNotes]);

  return (
    <Flex vertical gap={16} justify="flex-end">
      <Input.TextArea
        className={className}
        value={gameNotes}
        rows={isMobile ? 4 : 20}
        onChange={(e) => setGameNotes(e.target.value)}
        onBlur={() => saveNotes(gameNotes)}
        disabled={isSaving}
      />
    </Flex>
  );
};

export default Notes;
