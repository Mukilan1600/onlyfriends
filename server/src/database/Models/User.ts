import { Schema, Model, model, Document } from "mongoose";
import logger from "../../Logger/Logger";
import Chat, { IChat } from "./Chat";

export interface IUser extends Document {
  oauthId: string;
  name: string;
  username: string;
  avartarUrl: string;
  socketId: string;
  online: boolean;
  lastSeen: number;
  friendRequests: { user: IUser; ignored?: boolean; createdAt?: Date }[];
  friendRequestsSent: { user: IUser; createdAt?: Date }[];
  friends: {
    user: IUser;
    chat: IChat;
    createdAt?: Date;
  }[];
  chats: { chat: IChat }[];
  createdAt?: Date;
}

const userSchema = new Schema(
  {
    oauthId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    avatarUrl: { type: String },
    socketId: String,
    online: {
      type: Boolean,
      default: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    friends: {
      type: [
        {
          user: { type: Schema.Types.ObjectId, ref: "User" },
          chat: { type: Schema.Types.ObjectId, ref: "Chat" },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    friendRequests: {
      type: [
        {
          user: { type: Schema.Types.ObjectId, ref: "User" },
          ignored: { type: Boolean, default: false },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    friendRequestsSent: {
      type: [
        {
          user: { type: Schema.Types.ObjectId, ref: "User" },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    chats: {
      type: [
        {
          chat: { type: Schema.Types.ObjectId, ref: "Chat" },
        },
      ],
      default: [],
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);

const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;
export const findOrCreate = async (id: string, newUserDetails: any) => {
  try {
    const doc = await User.findOne({ oauthId: id });
    if (doc) {
      return doc;
    } else {
      let username = newUserDetails.username;
      let usernameTaken = await User.exists({ username: username });
      while (usernameTaken) {
        username = `${newUserDetails.username}#${
          Math.floor(Math.random() * 8999) + 1000
        }`;
        usernameTaken = await User.exists({ username: username });
      }
      const newUser = new User({
        oauthId: id,
        ...newUserDetails,
        username,
      });
      newUser.save();
      return newUser;
    }
  } catch (err) {
    logger.error(err);
  }
};

// Friends
export const getFriendRequestsSent = async (userId: string) => {
  try {
    const user = await User.findOne({ oauthId: userId }).populate(
      "friendRequestsSent.user",
      "oauthId name avatarUrl"
    );
    if (user) return user.friendRequestsSent;
  } catch (err) {
    logger.error(err, { service: "User.getFriendsList" });
  }
};

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
    if (user && user.username !== to) {
      const toUser = await User.findOneAndUpdate(
        {
          username: to,
          "friends.user": { $ne: user },
          "friendRequests.user": { $ne: user },
        },
        { $addToSet: { friendRequests: { user } } },
        { useFindAndModify: false, returnOriginal: false }
      )
        .populate({
          path: "friendRequests.user",
          select: "name online lastSeen avatarUrl socketId oauthId",
        })
        .exec();

      if (!toUser) return null;

      const index = user.friendRequestsSent.findIndex(
        (request) => request.user === toUser._id
      );
      if (index === -1) user.friendRequestsSent.push({ user: toUser });
      await user.save();
      return toUser;
    }
    return null;
  } catch (err) {
    logger.error(err, { service: "User.sendfriendrequest" });
  }
};

export const acceptFriendRequest = async (from: string, to: string) => {
  try {
    const user = await User.findOne({ oauthId: from });
    if (user) {
      const toUser = await User.findOneAndUpdate(
        {
          oauthId: to,
          "friendRequests.user": user,
        },
        { $pull: { friendRequests: { user: user._id } } },
        { useFindAndModify: false, returnOriginal: false }
      );
      if (toUser) {
        const newChat = new Chat({
          type: "personal",
          participants: [{ user: user }, { user: toUser }],
        });

        await user.updateOne({
          $addToSet: {
            friends: { user: toUser, chat: newChat },
            chats: { chat: newChat },
          },
          $pull: {
            friendRequests: { user: toUser._id },
            friendRequestsSent: { user: toUser._id },
          },
        });

        toUser.friends.push({ user: user, chat: newChat });
        toUser.chats.push({ chat: newChat });
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

export const getChatList = async (userId: string) => {
  try {
    const user = await User.findOne({
      oauthId: userId,
    }).populate({
      path: "chats.chat",
      populate: {
        path: "participants.user",
        select: "name oauthId avatarUrl socketId online lastSeen",
      },
    });
    if (user) return user.chats;
  } catch (error) {}
};
