import React from "react";
import PaperClipIcon from "../../../../statics/icons/PaperClipIcon";
import useChat from "../../../../stores/useChat";
import useFileUpload from "../../../../stores/useFileUpload";
import { toast } from "react-toastify";

const UploadInput: React.FC = () => {
  const { chat } = useChat();
  const { setFile } = useFileUpload();
  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0] && chat) {
      if (event.currentTarget.files[0].size > 15000000)
        toast("File size cannot exceed 15mb", { type: "error" });
      else setFile(event.currentTarget.files[0]);
    }
  };

  return (
    <div>
      <input hidden type="file" id="chat_file_input" onChange={onFileSelect} />
      <label htmlFor="chat_file_input" style={{ cursor: "pointer" }}>
        <PaperClipIcon />
      </label>
    </div>
  );
};

export default UploadInput;
