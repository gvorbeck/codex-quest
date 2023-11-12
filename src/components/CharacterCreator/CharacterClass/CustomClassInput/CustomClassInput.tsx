import { ChangeEvent, MouseEvent, useEffect } from "react";
import HomebrewWarning from "../../../HomebrewWarning/HomebrewWarning";
import DOMPurify from "dompurify";
import { Input } from "antd";
import { useDebounce } from "../../../../support/helpers";
import { CharacterData, SetCharacterData } from "../../../../data/definitions";

// TODO: Look into component rerendering as a cause for how long it takes to type in this field
type CustomClassInputProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  customClassInput: string;
  setCustomClassInput: (customClassInput: string) => void;
};

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
  };

  const handleClickCustomClassInput = (event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  const debouncedInput = useDebounce(customClassInput, 300);

  useEffect(() => {
    setCharacterData({ ...characterData, class: [debouncedInput] });
  }, [debouncedInput]);
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
