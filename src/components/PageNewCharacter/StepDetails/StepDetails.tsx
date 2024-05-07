import React from "react";
import { Flex, Input } from "antd";
import DOMPurify from "dompurify";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import { CharData } from "@/data/definitions";

interface StepDetailsProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
  newCharacter?: boolean;
}

const StepDetails: React.FC<
  StepDetailsProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter, newCharacter }) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleanInput = DOMPurify.sanitize(event.target.value);
    setCharacter((prevCharacter) => ({ ...prevCharacter, name: cleanInput }));
  };

  return (
    <Flex vertical className={className} gap={16}>
      <Input
        value={character.name}
        onChange={handleNameChange}
        placeholder="Name"
        maxLength={100}
      />
      {newCharacter && (
        <AvatarPicker character={character} setCharacter={setCharacter} />
      )}
    </Flex>
  );
};

export default StepDetails;
