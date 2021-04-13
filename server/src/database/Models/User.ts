import { Schema, Model, model, Document } from "mongoose";
import logger from "../../Logger/Logger";
import Chat, { IChat } from "./Chat";

export interface IUser extends Document {
  oauthId: string;
  name: string;
  avartarUrl: string;
  socketId: string;
  online: Boolean;
  lastSeen: number;
  friendRequests: { user: IUser; ignored?: boolean; createdAt?: Date }[];
  friends: {
    user: IUser;
    chat: IChat;
    createdAt?: Date;
  }[];
  chat: IChat[];
  createdAt?: Date;
}

const userSchema = new Schema({
  oauthId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatarUrl: { type: String },
  socketId: String,
  online: {
    type: Boolean,
    default: true,
  },
  lastSeen: {
    type: Date,
    default: Date.now(),
  },
  friends: {
    type: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        chat: { type: Schema.Types.ObjectId, ref: "Chat" },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
    default: [],
  },
  friendRequests: {
    type: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        ignored: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
    default: [],
  },
  chat: {
    type: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    default: [],
  },
  createdAt: { type: Date, default: Date.now() },
});

const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;

export const findOrCreate = async (id: string, newUserDetails: any) => {
  try {
    const doc = await User.findOne({ oauthId: id });
    if (doc) {
      return doc;
    } else {
      const newUser = new User({
        oauthId: id,
        ...newUserDetails,
      });
      newUser.save();
      return newUser;
    }
  } catch (err) {
    logger.error(err);
  }
};

// Friends
export const getFriendsList = async (userId: string) => {
  try {
    const user = await User.findOne({ oauthId: userId }).populate(
      "friends.user",
      "oauthId name online lastSeen avatarUrl"
    );
    if (user) return user.friends;
  } catch (err) {
    logger.error(err, { service: "User.getFriendsList" });
  }
};

export const sendFriendRequest = async (from: string, to: string) => {
  try {
    const user = await User.findOne({ oauthId: from });
    if (user) {
      const toUser = await User.findOneAndUpdate(
        {
          oauthId: to,
          "friends.user": { $ne: user },
        },
        { $addToSet: { friendRequests: { user } } },
        { useFindAndModify: false, returnOriginal: false }
      )
        .populate({
          path: "friendRequests.user",
          select: "name online lastSeen avatarUrl socketId oauthId",
        })
        .exec();
      return toUser;
    }
    return null;
  } catch (err) {
    logger.error(err, { service: "User.sendfriendrequest" });
  }
};

export const acceptFriendRequest = async (from: string, to: string) => {
  try {
    const user = await User.findOneAndUpdate({ oauthId: from });
    if (user) {
      const toUser = await User.findOneAndUpdate(
        {
          oauthId: to,
          "friendRequests.user": user,
        },
        { $pull: { friendRequests: user._id } },
        { useFindAndModify: false, returnOriginal: false }
      );
      if (toUser) {
        const newChat = new Chat({
          type: "personal",
          participants: [user, toUser],
        });
        user.friends.push({ user: toUser, chat: newChat });
        user.friendRequests = [...user.friendRequests].filter(
          (request) => request.user !== toUser._id
        );
        toUser.friends.push({ user: user, chat: newChat });
        await user.save();
        await toUser.save();
        await newChat.save();
        return { user };
      }
      return { user: null };
    }
    return { user: null };
  } catch (err) {
    logger.error(err, { service: "User.acceptfriendrequest" });
  }
};
