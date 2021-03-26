import http from 'http';
import express, { Express, Router } from "express";
import passport from "passport";
import expressSession from "express-session";
import WebSocket from '../websocket'
import cors from 'cors'

class Server {
  private app: Express;
  private server: http.Server;
  webSocket: WebSocket;
  constructor() {
    this.initializeServer();
    this.initializeWebSocket();
  }

  private initializeServer() {
    this.app = express();
    this.server = http.createServer(this.app);

    require("../Auth/passportAuth");
    this.app.use(cors())
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

  private initializeWebSocket(){
    this.webSocket = new WebSocket(this.server)
  }

  public addRoutes(router: Router, basePath?: string): void {
    if (basePath) this.app.use(basePath, router);
    else this.app.use(router);
  }

  public start(port: number | string, cb: () => void): void {
    this.server.listen(port, cb);
  }
}

export default Server;
