import React from "react";
import { CharData } from "@/data/definitions";
import {
  Radio,
  RadioChangeEvent,
  UploadFile,
  Divider,
  GetProp,
  Image,
} from "antd";
import Upload, { RcFile, UploadProps } from "antd/es/upload";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { PlusOutlined } from "@ant-design/icons";
import StockAvatars from "./StockAvatars/StockAvatars";
import CqDivider from "../CqDivider/CqDivider";

type AvatarPickerProps = {
  character: CharData;
  characterDispatch: React.Dispatch<any>;
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function AvatarPicker({
  character,
  characterDispatch,
}: AvatarPickerProps) {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [imageSource, setImageSource] = React.useState(0);

  async function handlePreview(file: UploadFile) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  }

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]; // Allowed file types: jpg, jpeg, png, webp
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
      characterDispatch({
        type: "SET_AVATAR",
        payload: {
          avatar: downloadURL,
        },
      });
    } catch (error) {
      console.error("Error during the file upload or document update:", error);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleChangeImageSource = (e: RadioChangeEvent) => {
    if (e.target.value === 0) {
      characterDispatch({
        type: "SET_AVATAR",
        payload: {
          avatar: "",
        },
      });
    }
    setImageSource(e.target.value);
  };

  const showUpload =
    imageSource === 2 ? (
      <>
        <Upload
          listType="picture-circle"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={() => false}
        >
          {fileList.length > 1 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </>
    ) : null;

  const showStockAvatars =
    imageSource === 1 ? (
      <StockAvatars
        character={character}
        characterDispatch={characterDispatch}
      />
    ) : null;

  return (
    <>
      <CqDivider>Avatar</CqDivider>
      <Radio.Group
        value={imageSource}
        onChange={handleChangeImageSource}
        buttonStyle="solid"
      >
        <Radio.Button value={0}>None</Radio.Button>
        <Radio.Button value={1}>Stock</Radio.Button>
        <Radio.Button value={2}>Upload</Radio.Button>
      </Radio.Group>
      {showUpload}
      {showStockAvatars}
    </>
  );
}
