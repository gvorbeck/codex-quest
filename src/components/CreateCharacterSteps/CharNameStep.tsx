import { Input, message, Upload } from "antd";
import { CharNameStepProps } from "../types";
import { UploadOutlined } from "@ant-design/icons";
import { storage } from "../../firebase";
import { UploadTaskSnapshot } from "firebase/storage";
import type { UploadProps } from "antd";

// function beforeUpload(file: any) {
//   const isJpgOrPng =
//     file.type === "image/jpeg" ||
//     file.type === "image/png" ||
//     file.type === "image/gif";
//   if (!isJpgOrPng) {
//     message.error("You can only upload JPG/PNG/GIF file!");
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error("Image must smaller than 2MB!");
//   }
//   return isJpgOrPng && isLt2M;
// }

// function handleUpload(options: UploadRequestOption) {
//   const { file, onSuccess, onError, onProgress } = options;
//   const uploadTask = storage.ref(`images/${file.name}`).put(file);

//   uploadTask.on(
//     "state_changed",
//     (snapshot: UploadTaskSnapshot) => {
//       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log("Upload is " + progress + "% done");
//       onProgress({ percent: progress }, file);
//     },
//     (error: Error) => {
//       // Handle unsuccessful uploads
//       console.log(error);
//       onError(error);
//     },
//     async () => {
//       // Handle successful uploads on complete
//       try {
//         const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
//         console.log("File available at", downloadURL);
//         onSuccess({ downloadURL }, file);
//       } catch (error) {
//         onError(error);
//       }
//     }
//   );
// }

export default function CharNameStep({ name, setName }: CharNameStepProps) {
  return (
    <>
      <Input />
      {/* <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // You can remove this when using Firebase Storage
        beforeUpload={beforeUpload}
        customRequest={handleUpload}
      >
        <div>
          <UploadOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload> */}
    </>
  );
}
