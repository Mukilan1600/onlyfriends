import { Router } from "express";
import passport from "passport";
import { ensureLoggedIn } from "connect-ensure-login";
import logger from "../../Logger/Logger";

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
    res.redirect("/api/auth/profile");
  }
);
router.get(
  "/profile",
  ensureLoggedIn({ redirectTo: "/api/auth/oauth" }),
  (req, res) => {
    res.json(req.user);
  }
);

router.get("/logout", (req,res) => {
  req.logOut();
  req.session.destroy((err) => {
    if(err){
      logger.error(err)
      return res.status(500).send({msg: "Internal server error"})
    }
    return res.redirect("/")
  });
})

export default router;
