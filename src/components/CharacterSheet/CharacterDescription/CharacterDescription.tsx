import { Button, Input, Tooltip, Typography } from "antd";
import { useEffect, useState, useRef, FC } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import {
  CharacterDescriptionProps,
  DescriptionFieldButtonProps,
} from "./definitions";
import DOMPurify from "dompurify";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { getClassType } from "../../../support/helpers";

export default function Description({
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

  // Button component for adding and deleting text fields
  const DescriptionFieldButton: FC<DescriptionFieldButtonProps> = ({
    handler,
    icon,
    className,
  }) => {
    const buttonClassNames = classNames("absolute", "left-0", className);
    return (
      <Tooltip title="Add text field" className={buttonClassNames}>
        <Button type="primary" shape="circle" icon={icon} onClick={handler} />
      </Tooltip>
    );
  };

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
      <div className="grid gap-4">
        {typeof characterData.desc === "object" &&
          characterData.desc.map((desc: string, index: number) => {
            return (
              <div className="relative pl-12" key={index}>
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
                    className={index > 0 ? "top-12" : ""}
                  />
                )}
                <Input.TextArea
                  key={index}
                  value={desc}
                  rows={10}
                  name="Bio & Notes"
                  placeholder={`Write anything and everything about ${characterData.name}`}
                  onChange={(e) => handleTextAreaChange(e.target.value, index)}
                  disabled={!userIsOwner}
                  onBlur={() => handleImmediateUpdate()}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
