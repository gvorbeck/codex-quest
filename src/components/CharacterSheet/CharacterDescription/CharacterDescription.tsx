import { Input, Typography } from "antd";
import { useEffect, useState, useRef, FC } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import { CharacterDescriptionProps } from "./definitions";
import DOMPurify from "dompurify";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { getClassType } from "../../../support/helpers";
import DescriptionFieldButton from "./DescriptionFieldButton/DescriptionFieldButton";

export default function CharacterDescription({
  characterData,
  setCharacterData,
  userIsOwner,
}: CharacterDescriptionProps) {
  // Hooks and state variables
  const { uid, id } = useParams();
  const initialDesc = Array.isArray(characterData.desc)
    ? characterData.desc
    : [characterData.desc];
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [textAreaValues, setTextAreaValues] = useState<string[]>(initialDesc);
  const placeholderSavingThrows = `"${characterData.class}" SAVING THROWS\n----------\nDEATH RAY or POISON: 00\nMAGIC WANDS: 00\nPARALYSIS or PETRIFY: 00\nDRAGON BREATH: 00\nSPELLS: 00`;

  // Function to update the database
  const updateDatabase = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }
    const sanitizedValues = textAreaValues.map((value) =>
      DOMPurify.sanitize(value)
    );
    if (
      JSON.stringify(characterData.desc) !== JSON.stringify(sanitizedValues)
    ) {
      const docRef = doc(db, "users", uid, "characters", id);
      try {
        await updateDoc(docRef, {
          desc: sanitizedValues,
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

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
  const handleImmediateUpdate = async () => {
    await updateDatabase();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Effect to initialize characterData.desc
  useEffect(() => {
    if (typeof characterData.desc === "string") {
      setCharacterData({
        ...characterData,
        desc: [characterData.desc],
      });
    }
  }, [characterData.desc]);

  // Effect to update characterData.desc when textAreaValues change
  useEffect(() => {
    setCharacterData({
      ...characterData,
      desc: textAreaValues,
    });
  }, [textAreaValues]);

  // Effect to handle database update with a delay
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      updateDatabase();
    }, 1000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [textAreaValues]);

  return (
    <div>
      <div className="flex items-baseline gap-4">
        <Typography.Title level={3} className="mt-0 !text-shipGray">
          Bio & Notes
        </Typography.Title>
        {getClassType(characterData.class) === "custom" && (
          <HelpTooltip
            text={`You can clear this field to restore the "${characterData.class}" Saving Throws template.`}
          />
        )}
      </div>
      <>
        {typeof characterData.desc === "object" &&
          characterData.desc.map((desc: string, index: number) => {
            return (
              <div className="relative pt-12 lg:pt-0 lg:pl-12" key={index}>
                {index > 0 && (
                  <DescriptionFieldButton
                    handler={() => handleDeleteDescriptionField(index)}
                    icon={<MinusCircleOutlined />}
                  />
                )}
                {index === characterData.desc.length - 1 && index < 9 && (
                  <DescriptionFieldButton
                    handler={handleAddDescriptionField}
                    icon={<PlusCircleOutlined />}
                    className={index > 0 ? "top-0 lg:top-12" : ""}
                  />
                )}
                <Input.TextArea
                  key={index}
                  value={
                    index === 0 &&
                    desc === "" &&
                    getClassType(characterData.class) === "custom"
                      ? placeholderSavingThrows
                      : desc
                  }
                  rows={10}
                  maxLength={10000}
                  name="Bio & Notes"
                  placeholder={`Write anything and everything about ${characterData.name}`}
                  onChange={(e) => handleTextAreaChange(e.target.value, index)}
                  disabled={!userIsOwner}
                  onBlur={() => handleImmediateUpdate()}
                />
              </div>
            );
          })}
      </>
    </div>
  );
}
