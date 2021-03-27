import { Schema, Model, model, Document } from "mongoose";
import logger from "../../Logger/Logger";

export interface IUser extends Document {
  oauthId: string;
  name: string;
  avartarUrl: string;
  socketId: string;
  online: Boolean;
  lastSeen: number;
  friendRequests: [IUser];
  friends: [IUser];
  chat: [{ type: Schema.Types.ObjectId; ref: "Chat" }];
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
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
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
export const sendFriendRequest = async (from: string, to: string) => {
  try {
    const user = await User.findOne({ oauthId: from });
    if (user) {
      const toUser = await User.findOneAndUpdate(
        {
          oauthId: to,
        },
        { $addToSet: { friendRequests: user } },
        { useFindAndModify: false }
      )
        .populate({ path: "friendRequests", select: "name online lastSeen avatarUrl socketId" })
        .exec();
      console.log(toUser);
      return toUser;
    }
    return null;
  } catch (err) {
    logger.error(err);
  }
};
