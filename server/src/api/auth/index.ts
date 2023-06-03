import { RequestHandler, Router } from "express";
import passport from "passport";
import logger from "../../Logger/Logger";
import jwt from "jsonwebtoken";
import User, { IUser } from "../../database/Models/User";

const ensureLoggedIn: RequestHandler = (req, res, next) => {
  const user = req.user as IUser;
  if (user === undefined || !user) return res.redirect(process.env.CLIENT);
  return next();
};

const router = Router();

router.get(
  "/oauth",
  passport.authenticate("google", {
    scope: ["profile"],
    prompt: "consent",
    accessType: "offline",
  })
);
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/fail",
    scope: ["profile"],
  }),
  (req, res) => {
    const user = req.user as IUser;
    const jwtTok = jwt.sign({ oauthId: user.oauthId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.redirect(`${process.env.CLIENT}/?jwtTok=${jwtTok}`);
  }
);

router.get("/logout", ensureLoggedIn, (req, res) => {
  const user = req.user as IUser;
  User.findOneAndUpdate(
    { oauthId: user.oauthId },
    { online: false, lastSeen: Date.now() },
    { useFindAndModify: false },
    (err) => {
      if (err) {
        logger.error(err);
        return res.status(500).send({ msg: "Internal server error" });
      }

      req.logOut((err) => {
        req.session.destroy((err) => {
          if (err) {
            logger.error(err);
            return res.status(500).send({ msg: "Internal server error" });
          }
          return res.redirect(`${process.env.CLIENT}/`);
        });
      });
    }
  );
});

export default router;
