import { Schema, model, Document, Model } from "mongoose";
import { IUser } from "./User";

interface IText extends Document {
  type: "message" | "file";
  reply: boolean;
  replyTo: string;
  fileUrl?: string;
  message?: string;
  time: Date;
}

export interface IChat extends Document {
  type: "personal" | "group";
  participants: IUser[];
  messages: IText[];
}

const textSchema = new Schema({
  type: String,
  reply: { type: Boolean, default: false },
  replyTo: { type: Schema.Types.ObjectId, ref: "Chat.messages" },
  fileUrl: String,
  message: String,
  time: { type: Date, default: Date.now() },
});

const chatSchema = new Schema({
  type: String,
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: { type: [textSchema], default: [] },
});

const Chat: Model<IChat> = model<IChat>("Chat", chatSchema);

export default Chat;
