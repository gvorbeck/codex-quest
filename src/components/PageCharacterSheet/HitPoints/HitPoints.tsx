import { Flex, Input, InputNumber, Typography } from "antd";
import React from "react";
import DOMPurify from "dompurify";
import { CharacterDataContext } from "@/store/CharacterContext";

const HitPoints: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const { character, setCharacter, userIsOwner } =
    React.useContext(CharacterDataContext);
  const [inputValue, setInputValue] = React.useState(character.hp.points);
  const [descValue, setDescValue] = React.useState(character.hp.desc || "");

  const handleInputChange = (value: number | null) => {
    if (value && !isNaN(value)) {
      // Update local state
      setInputValue(value);

      // Update character state
      setCharacter({
        ...character,
        hp: {
          ...character.hp,
          points: value,
        },
      });
    }
  };

  const handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedInput = DOMPurify.sanitize(event.target.value);
    setDescValue(sanitizedInput);
  };

  const handleDescBlur = () => {
    setCharacter({
      ...character,
      hp: {
        ...character.hp,
        desc: descValue,
      },
    });
  };

  return (
    <Flex vertical className={className} gap={16}>
      <InputNumber
        value={inputValue}
        min={0}
        max={character.hp.max}
        disabled={!userIsOwner}
        onChange={handleInputChange}
        name="Hit Points"
        id="hit-points"
        addonAfter={`max: ${character.hp.max}`}
      />
      <label htmlFor="hit-points" className="hidden">
        Hit Points
      </label>
      <div>
        <Input.TextArea
          value={descValue}
          rows={4}
          maxLength={500}
          placeholder="Wounds and Conditions"
          disabled={!userIsOwner}
          onChange={handleDescChange}
          onBlur={handleDescBlur}
          name="Wounds and Conditions"
        />
        <Typography.Text type="secondary" className="text-xs">
          Character count: {descValue.length}/500
        </Typography.Text>
      </div>
    </Flex>
  );
};

export default HitPoints;
