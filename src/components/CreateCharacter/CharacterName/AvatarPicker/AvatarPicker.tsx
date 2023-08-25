import { AvatarPickerProps } from "./definitions";
import { Radio, Typography, RadioChangeEvent } from "antd";

export default function AvatarPicker({
  characterData,
  setCharacterData,
  imageSource,
  setImageSource,
}: AvatarPickerProps) {
  const handleChangeImageSource = (e: RadioChangeEvent) => {
    setCharacterData({ ...characterData, avatar: "" });
    setImageSource(e.target.value);
  };

  return (
    <>
      <Typography.Title level={2} className="text-shipGray">
        Avatar
      </Typography.Title>
      <Radio.Group
        value={imageSource}
        onChange={handleChangeImageSource}
        buttonStyle="solid"
      >
        <Radio.Button value={0}>None</Radio.Button>
        <Radio.Button value={1}>Stock</Radio.Button>
        <Radio.Button value={2}>Upload</Radio.Button>
      </Radio.Group>
    </>
  );
}
