import { ChangeEvent, MouseEvent } from "react";
import HomebrewWarning from "../../../HomebrewWarning/HomebrewWarning";
import { CustomClassInputProps } from "./definitions";
import DOMPurify from "dompurify";
import { Input } from "antd";

export default function CustomClassInput({
  characterData,
  setCharacterData,
  customClassInput,
  setCustomClassInput,
}: CustomClassInputProps) {
  const handleChangeCustomClassInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const cleanInput = DOMPurify.sanitize(event.target.value);
    setCustomClassInput(cleanInput);
    setCharacterData({ ...characterData, class: cleanInput });
  };

  const handleClickCustomClassInput = (event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };
  return (
    <>
      <HomebrewWarning homebrew="Class" className="my-4" />
      <Input
        value={customClassInput}
        onChange={handleChangeCustomClassInput}
        placeholder="Custom Class"
        onClick={handleClickCustomClassInput}
      />
    </>
  );
}
