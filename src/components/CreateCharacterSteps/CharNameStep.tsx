import React, { ChangeEvent, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Input, Modal, Upload } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { CharNameStepProps } from "../types";
import { storage, ref, uploadBytes } from "../../firebase";
import { getDownloadURL } from "firebase/storage";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function CharNameStep({ name, setName }: CharNameStepProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
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
    const maxSize = 5 * 1024 * 1024; // Maximum file size in bytes (5MB)

    const filteredList = newFileList.filter((file) => {
      const isAllowedType = file.type
        ? allowedTypes.includes(file.type)
        : false;
      const isBelowMaxSize = file.size ? file.size <= maxSize : false;
      // You can also add validation for dimensions here if needed

      if (!isAllowedType) {
        console.log(`${file.name} is not an allowed file type.`);
      }
      if (!isBelowMaxSize) {
        console.log(`${file.name} exceeds the maximum file size.`);
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
            console.log("Download URL:", downloadURL);
          });
        })
        .catch((error: Error) => {
          console.log("Upload error:", error);
        });
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
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
      <Input value={name} onChange={handleNameChange} />
    </>
  );
}
