import React from "react";
import { CharData } from "@/data/definitions";
import { Radio, Typography, RadioChangeEvent, UploadFile, Modal } from "antd";
import { getBase64 } from "@/support/accountSupport";
import Upload, { RcFile, UploadProps } from "antd/es/upload";
import { getDownloadURL } from "firebase/storage";
import { storage, ref, uploadBytes } from "@/firebase";
import { PlusOutlined } from "@ant-design/icons";
import StockAvatars from "./StockAvatars/StockAvatars";

type AvatarPickerProps = {
  character: CharData;
  setCharacter: (character: CharData) => void;
};

export default function AvatarPicker({
  character,
  setCharacter,
}: AvatarPickerProps) {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [imageSource, setImageSource] = React.useState(0);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1),
    );
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const allowedTypes = ["image/jpeg", "image/png"]; // Allowed file types
    const maxSize = 1 * 1024 * 1024; // Maximum file size in bytes (1MB)

    const latestFile = newFileList[newFileList.length - 1]; // Get the latest file added
    const isAllowedType = latestFile.type
      ? allowedTypes.includes(latestFile.type)
      : false;
    const isBelowMaxSize = latestFile.size ? latestFile.size <= maxSize : false;

    // If the file is not valid, log an error and do not proceed
    if (!isAllowedType || !isBelowMaxSize) {
      if (!isAllowedType) {
        console.error(`${latestFile.name} is not an allowed file type.`);
      }
      if (!isBelowMaxSize) {
        console.error(`${latestFile.name} exceeds the maximum file size.`);
      }
      return; // Stop the execution if the file is invalid
    }

    setFileList([latestFile]); // Keep only the latest file in the state

    // Prepare to upload the file to Firebase Storage
    const directory = "avatars";
    const fileName = `${directory}/${latestFile.name}`;
    const storageRef = ref(storage, fileName);

    try {
      const fileData = await getBase64(latestFile.originFileObj as RcFile); // Convert to base64 for preview
      latestFile.preview = fileData;

      // Upload the file
      await uploadBytes(storageRef, latestFile.originFileObj as Blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Update the character's avatar in the local state
      const updatedCharacterData = { ...character, avatar: downloadURL };
      setCharacter(updatedCharacterData);
    } catch (error) {
      console.error("Error during the file upload or document update:", error);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleChangeImageSource = (e: RadioChangeEvent) => {
    setCharacter({ ...character, avatar: "" });
    setImageSource(e.target.value);
  };

  return (
    <>
      <Typography.Title level={5} className="text-shipGray">
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
      {imageSource === 2 && (
        <>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            className="mt-4"
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </>
      )}
      {imageSource === 1 && (
        <StockAvatars character={character} setCharacter={setCharacter} />
      )}
    </>
  );
}
