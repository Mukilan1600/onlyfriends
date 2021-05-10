import React, { useContext, useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import { v4 as uuid } from "uuid";
import useFileUpload from "../../../../stores/useFileUpload";
import FileIcon from "../../../../statics/icons/FileIcon";
import useChat, { IMessage } from "../../../../stores/useChat";
import { WebSocketContext } from "../../../../providers/WebSocketProvider";
import styled from "styled-components";

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 12px;
  border-radius: 6px;
  background: #525252;
  margin: 0px 10px;
`;

const ProgressBarTrack = styled.div<{ width: number }>`
  border-radius: 7px;
  height: 100%;
  width: ${({ width }) => `${width}%`};
  background: #55a3ff;
`;

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <ProgressBarWrapper>
      <ProgressBarTrack width={progress} />
    </ProgressBarWrapper>
  );
};

const FileUploadDialog: React.FC = () => {
  const uploadTask = useRef<firebase.storage.UploadTask>();
  const [progress, setProgress] = useState(0);
  const { socket } = useContext(WebSocketContext);
  const { file, setFile } = useFileUpload();
  const { chat } = useChat();

  useEffect(() => {
    if (!file) return;
    const fileExt = file.name.split(".");
    const newFileRefPath = `/chat/${chat._id}/${uuid()}.${
      fileExt[fileExt.length - 1]
    }`;
    uploadTask.current = firebase.storage().ref(newFileRefPath).put(file);

    uploadTask.current.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        if (error.code !== "storage/canceled") console.error(error);
      },
      () => setProgress(100.1)
    );
  }, []);

  const cancelUpload = () => {
    if (uploadTask.current) {
      uploadTask.current.cancel();
      if (progress === 100.1) uploadTask.current.snapshot.ref.delete();
    }
    setFile(null);
  };

  const sendFile = async () => {
    const fileUrl = await uploadTask.current.snapshot.ref.getDownloadURL();
    const newMessage: IMessage = {
      type: "file",
      fileUrl,
      fileName: file.name,
    };
    socket.emit("send_message", chat._id, newMessage);
    setFile(null);
  };

  return (
    <>
      <button onClick={cancelUpload}>Back</button>
      <FileIcon fill={"#525252"} />
      <ProgressBar progress={progress} />
      <button onClick={sendFile} disabled={progress < 100.1}>
        Send
      </button>
    </>
  );
};

export default FileUploadDialog;
