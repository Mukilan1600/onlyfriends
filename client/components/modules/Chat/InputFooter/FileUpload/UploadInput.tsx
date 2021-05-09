import firebase from "firebase/app";
import "firebase/storage";
import React, { useContext } from "react";
import PaperClipIcon from "../../../../statics/icons/PaperClipIcon";
import useChat, { IMessage } from "../../../../stores/useChat";
import { v4 as uuid } from "uuid";
import { WebSocketContext } from "../../../../providers/WebSocketProvider";

const UploadInput: React.FC = () => {
  const { socket } = useContext(WebSocketContext);
  const { chat } = useChat();
  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0] && chat) {
      const file = event.currentTarget.files[0];
      const fileExt = file.name.split(".");
      const newFileRefPath = `/chat/${chat._id}/${uuid()}.${
        fileExt[fileExt.length - 1]
      }`;
      const newFileUpload = firebase.storage().ref(newFileRefPath).put(file);

      newFileUpload
        .then(async (snapshot) => {
          const fileUrl = await snapshot.ref.getDownloadURL();
          const newMessage: IMessage = {
            type: "file",
            fileUrl,
            fileName: file.name,
          };
          socket.emit("send_message", chat._id, newMessage);
        })
        .catch((reason) => {
          console.error(reason);
        });
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
