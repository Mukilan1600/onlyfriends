import { Schema, model, Document, Model } from "mongoose";
import { IUser } from "./User";

interface IText extends Document {
  type: "message" | "file" | "reply";
  sentBy: string;
  reply: boolean;
  replyTo?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: "file" | "image" | "video";
  message?: {
    type: "emote" | "text" | "link";
    id?: string;
    msg?: string;
  };
  createdAt?: Date;
  readBy?: IUser[];
}

export interface IChat extends Document {
  type: "personal" | "group";
  participants: { unread: number; user: IUser }[];
  messages: IText[];
  createdAt?: Date;
}

const textSchema = new Schema(
  {
    type: String,
    sentBy: { type: Schema.Types.ObjectId, ref: "User" },
    reply: { type: Boolean, default: false },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
    fileUrl: String,
    fileName: String,
    fileType: String,
    message: [
      {
        type: { type: String },
        id: { type: String, required: false },
        msg: { type: String, required: false },
      },
    ],
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: "createdAt" } }
);

const chatSchema = new Schema(
  {
    type: String,
    participants: [
      {
        unread: { type: Number, default: 0 },
        user: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    messages: {
      type: [{ type: Schema.Types.ObjectId, ref: "Message" }],
      default: [],
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);

const Chat: Model<IChat> = model<IChat>("Chat", chatSchema);
export const Message: Model<IText> = model<IText>("Message", textSchema);
export default Chat;
