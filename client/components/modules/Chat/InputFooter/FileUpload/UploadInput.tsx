import React, { useContext } from "react";
import PaperClipIcon from "../../../../statics/icons/PaperClipIcon";
import useChat, { IMessage } from "../../../../stores/useChat";
import { WebSocketContext } from "../../../../providers/WebSocketProvider";
import useFileUpload from "../../../../stores/useFileUpload";

const UploadInput: React.FC = () => {
  const { socket } = useContext(WebSocketContext);
  const { chat } = useChat();
  const { setFile } = useFileUpload();
  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0] && chat) {
      setFile(event.currentTarget.files[0]);
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
