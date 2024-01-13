import React from "react";
import { Flex, Input } from "antd";
import DOMPurify from "dompurify";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import { CharData } from "@/data/definitions";

interface StepDetailsProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const StepDetails: React.FC<
  StepDetailsProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleanInput = DOMPurify.sanitize(event.target.value);
    setCharacter({ ...character, name: cleanInput });
  };

  return (
    <Flex vertical className={className}>
      <Input
        value={character.name}
        onChange={handleNameChange}
        placeholder="Name"
      />
      <AvatarPicker character={character} setCharacter={setCharacter} />
    </Flex>
  );
};

export default StepDetails;
