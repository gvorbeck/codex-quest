import { Flex, Input } from "antd";
import React from "react";
import DOMPurify from "dompurify";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import DescriptionFieldButton from "../CollapseEquipment/DescriptionFieldButton/DescriptionFieldButton";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import { getClassType } from "@/support/classSupport";

type DescriptionProps = {
  isMobile: boolean;
};

const Description: React.FC<
  DescriptionProps & React.ComponentPropsWithRef<"div">
> = ({ isMobile }) => {
  const { character, setCharacter, userIsOwner } =
    React.useContext(CharacterDataContext);
  const initialDesc = Array.isArray(character.desc)
    ? character.desc || [""]
    : [character.desc || ""];
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [textAreaValues, setTextAreaValues] =
    React.useState<string[]>(initialDesc);
  const placeholderSavingThrows = `"${character.class}" SAVING THROWS\n----------\nDEATH RAY or POISON: 00\nMAGIC WANDS: 00\nPARALYSIS or PETRIFY: 00\nDRAGON BREATH: 00\nSPELLS: 00`;

  // Function to add a new description field
  const handleAddDescriptionField = () => {
    const newTextAreaValues = [...textAreaValues, ""];
    setTextAreaValues(newTextAreaValues);
  };

  // Function to delete a description field
  const handleDeleteDescriptionField = (index: number) => {
    const newTextAreaValues = textAreaValues.filter((_, i) => i !== index);
    setTextAreaValues(newTextAreaValues);
  };

  // Function to handle text area changes
  const handleTextAreaChange = (value: string, index: number) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    const newTextAreaValues = [...textAreaValues];
    newTextAreaValues[index] = sanitizedValue;
    setTextAreaValues(newTextAreaValues);
  };

  // Function to handle immediate database update on blur
  const handleImmediateUpdate = () => {
    setCharacter({
      ...character,
      desc: textAreaValues || "",
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Side-Effect to initialize character.desc
  React.useEffect(() => {
    if (typeof character.desc === "string") {
      setCharacter({
        ...character,
        desc: [character.desc || ""],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.desc]);

  // Effect to handle database update with a delay
  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCharacter({
        ...character,
        desc: textAreaValues || "",
      });
    }, 1000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textAreaValues]);

  return (
    <Flex vertical gap={16}>
      {textAreaValues.map((desc: string, index: number) => (
        <Flex vertical={isMobile} key={index} gap={16}>
          <Flex vertical={!isMobile}>
            {index > 0 && (
              <DescriptionFieldButton
                handler={() => handleDeleteDescriptionField(index)}
                icon={<MinusCircleOutlined />}
              />
            )}
            {index === character.desc?.length - 1 && index < 9 && (
              <DescriptionFieldButton
                handler={handleAddDescriptionField}
                icon={<PlusCircleOutlined />}
              />
            )}
          </Flex>
          <Input.TextArea
            key={index}
            value={
              index === 0 &&
              desc === "" &&
              getClassType(character.class) === "custom"
                ? placeholderSavingThrows
                : desc
            }
            rows={10}
            maxLength={10000}
            name="Bio & Notes"
            placeholder={`Write anything and everything about ${character.name}`}
            onChange={(e) => handleTextAreaChange(e.target.value, index)}
            disabled={!userIsOwner}
            onBlur={() => handleImmediateUpdate()}
            className={
              !isMobile && index === 0 && textAreaValues.length > 1
                ? "ml-12"
                : ""
            }
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default Description;
