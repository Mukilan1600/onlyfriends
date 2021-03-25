import { Schema, Model, model, Document } from "mongoose";
import logger from "../../Logger/Logger";

interface IUser extends Document {
  name: String;
  avartarUrl: String;
  oauthId: String;
  friends: [String];
  chat: [string];
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
  friends: {
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
