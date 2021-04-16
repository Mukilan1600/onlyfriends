import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import logger from "../Logger/Logger";
import User, { findOrCreate, IUser } from "../database/Models/User";

passport.serializeUser((user: IUser, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (obj: string, cb) => {
  try {
    const user = await User.findById(obj);
    return cb(null, user);
  } catch (err) {
    logger.error(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: "/api/auth/callback",
    },
    async (accessTok, refreshTok, profile, cb) => {
      try {
        const user = await findOrCreate(profile.id, {
          name: profile.displayName,
          avatarUrl: profile.photos[0].value,
          username: profile.name.givenName.toLowerCase()
        });
        return cb(null, user);
      } catch (err) {
        logger.error(err);
        return cb(err, null);
      }
    }
  )
);
