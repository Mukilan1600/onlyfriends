import { Schema, Model, model, Document } from "mongoose";
import logger from "../../Logger/Logger";
import Chat, {IChat} from "./Chat";

export interface IUser extends Document {
  oauthId: string;
  name: string;
  avartarUrl: string;
  socketId: string;
  online: Boolean;
  lastSeen: number;
  friendRequests: [IUser];
  friends: [{
    user: IUser,
    chat: IChat,
  }];
  chat: [IChat];
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
      },
    ],
    default: [],
  },
  friendRequests: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  chat: {
    type: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    default: [],
  },
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
  try{
    const user = await User.findOne({oauthId: userId}).populate("friends.user")
    if(user)
      return user.friends;
  }catch(err){
    logger.error(err, {service: "User.getFriendsList"});
  }
}

export const sendFriendRequest = async (from: string, to: string) => {
  try {
    const user = await User.findOne({ oauthId: from });
    if (user) {
      const toUser = await User.findOneAndUpdate(
        {
          oauthId: to,
          'friends.user': {$ne: user}
        },
        { $addToSet: { friendRequests: user } },
        { useFindAndModify: false, returnOriginal: false }
      )
        .populate({
          path: "friendRequests",
          select: "name online lastSeen avatarUrl socketId oauthId",
        })
        .exec();
      return toUser;
    }
    return null;
  } catch (err) {
    logger.error(err, {service: "User.sendfriendrequest"});
  }
};

export const acceptFriendRequest = async (from: string, to: string) => {
  try {
    const user = await User.findOne({ oauthId: from });
    if (user) {
      const toUser = await User.findOneAndUpdate(
        {
          oauthId: to,
          friendRequests:  user
        },
        { $pull: { friendRequests: user._id } },
        { useFindAndModify: false, returnOriginal: false }
        );
      if(toUser){
        const newChat = new Chat({
          type: "personal",
          participants: [user, toUser],
        })
        user.friends.push({user: toUser, chat: newChat})
        toUser.friends.push({user: user, chat: newChat});
        user.save();
        toUser.save();
        newChat.save();
        return toUser
      }
    }
    return null;
  } catch (err) {
    logger.error(err, {service: "User.acceptfriendrequest"});
  }
}
