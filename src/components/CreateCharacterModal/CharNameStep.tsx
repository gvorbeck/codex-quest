import { ChangeEvent, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Typography,
  Upload,
} from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { CharNameStepProps, CharSteps } from "../types";
import { storage, ref, uploadBytes } from "../../firebase";
import { getDownloadURL } from "firebase/storage";
import { images } from "../../assets/images/faces/imageAssets";

const StockAvatars = ({ setCharacterData, characterData }: CharSteps) => {
  const [selectedAvatar, setSelectedAvatar] = useState("");

  return (
    <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-5 lg:w-[75%]">
      {images.map((image) => (
        <Button
          key={image}
          type="link"
          className="h-auto w-auto leading-none p-0 border-none"
          onClick={() => {
            setCharacterData({ ...characterData, avatar: image });
            setSelectedAvatar(image);
          }}
        >
          <img
            alt="Avatar"
            src={image}
            className={`w-16 rounded-[50%] border-2 border-solid ${
              image === selectedAvatar
                ? "border-seaBuckthorn"
                : "border-transparent"
            }`}
          />
        </Button>
      ))}
    </div>
  );
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function CharNameStep({
  characterData,
  setCharacterData,
}: CharNameStepProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageSource, setImageSource] = useState(0);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setCharacterData({ ...characterData, name: newName });
    // setName(newName);
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    // Validate file type, size, or dimensions here
    const allowedTypes = ["image/jpeg", "image/png"]; // Allowed file types
    const maxSize = 1 * 1024 * 1024; // Maximum file size in bytes (5MB)

    const filteredList = newFileList.filter((file) => {
      const isAllowedType = file.type
        ? allowedTypes.includes(file.type)
        : false;
      const isBelowMaxSize = file.size ? file.size <= maxSize : false;
      // You can also add validation for dimensions here if needed

      if (!isAllowedType) {
        console.error(`${file.name} is not an allowed file type.`);
      }
      if (!isBelowMaxSize) {
        console.error(`${file.name} exceeds the maximum file size.`);
      }

      return isAllowedType && isBelowMaxSize;
    });

    setFileList(filteredList);

    // Upload the file to Firebase Storage
    for (const file of filteredList) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }

      const directory = "avatars";
      const fileName = `${directory}/${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytes(storageRef, file.originFileObj as Blob);

      uploadTask
        .then(() => {
          // Upload completed successfully
          getDownloadURL(storageRef).then((downloadURL) => {
            setCharacterData({ ...characterData, avatar: downloadURL });
          });
        })
        .catch((error: Error) => {
          console.error("Upload error:", error);
        });
    }
  };

  const handleChangeImageSource = (e: RadioChangeEvent) => {
    setCharacterData({ ...characterData, avatar: "" });
    setImageSource(e.target.value);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Input
        value={characterData.name}
        onChange={handleNameChange}
        placeholder="Name"
      />
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
        <StockAvatars
          characterData={characterData}
          setCharacterData={setCharacterData}
        />
      )}
    </>
  );
}
