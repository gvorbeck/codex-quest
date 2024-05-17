import React from "react";
import { Flex, Input } from "antd";
import DOMPurify from "dompurify";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import { CharData, CharDataAction } from "@/data/definitions";

interface StepDetailsProps {
  character: CharData;
  newCharacter?: boolean;
  characterDispatch: React.Dispatch<CharDataAction>;
}

const StepDetails: React.FC<
  StepDetailsProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, characterDispatch, newCharacter }) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    characterDispatch({
      type: "SET_NAME",
      payload: {
        name: DOMPurify.sanitize(event.target.value),
      },
    });
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
        <AvatarPicker
          character={character}
          characterDispatch={characterDispatch}
        />
      )}
    </Flex>
  );
};

export default StepDetails;
