import { Schema, model, Document, Model } from "mongoose";
import { IUser } from "./User";

interface IText extends Document {
  type: "message" | "file" | "reply";
  sentBy: string;
  reply: boolean;
  replyTo?: string;
  fileUrl?: string;
  message?: string;
  createdAt?: Date;
}

export interface IChat extends Document {
  type: "personal" | "group";
  participants: IUser[];
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
      ref: "Chat.messages",
      required: false,
    },
    fileUrl: String,
    message: String,
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: "createdAt" } }
);

const chatSchema = new Schema(
  {
    type: String,
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: { type: [textSchema], default: [] },
  },
  { timestamps: { createdAt: "createdAt" } }
);

const Chat: Model<IChat> = model<IChat>("Chat", chatSchema);
export default Chat;
