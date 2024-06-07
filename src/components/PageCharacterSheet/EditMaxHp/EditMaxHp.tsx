import { CharacterDataContext } from "@/store/CharacterContext";
import { InputNumber, Typography } from "antd";
import React from "react";

const EditMaxHp: React.FC = () => {
  const { character, characterDispatch, userIsOwner } =
    React.useContext(CharacterDataContext);

  const handleInputChange = (value: number | null) => {
    if (value && !isNaN(value)) {
      // Update character state
      characterDispatch({
        type: "UPDATE",
        payload: {
          hp: {
            ...character.hp,
            max: value,
          },
        },
      });
    }
  };

  return (
    <>
      <Typography.Text>Edit the Max HP</Typography.Text>
      <InputNumber
        value={character.hp.max}
        onChange={handleInputChange}
        disabled={!userIsOwner}
      />
    </>
  );
};

export default EditMaxHp;
