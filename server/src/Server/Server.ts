import express, { Express, Router } from "express";
import passport from "passport";
import expressSession from "express-session";

class Server {
  private app: Express;
  constructor() {
    this.initializeServer();
  }

  private initializeServer() {
    this.app = express();

    require("../Auth/passportAuth");

    this.app.use(express.json());
    this.app.use(
      expressSession({
        cookie: { maxAge: 1000*60*60*24*7 },
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
      })
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  public addRoutes(router: Router, basePath?: string): void {
    if (basePath) this.app.use(basePath, router);
    else this.app.use(router);
  }

  public start(port: number | string, cb: () => void): void {
    this.app.listen(port, cb);
  }
}

export default Server;
