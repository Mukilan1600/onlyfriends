import { Server } from "http";
import socketio from "socket.io";
import logger from "../Logger/Logger";
import jwt from "jsonwebtoken";
import User, {sendFriendRequest} from "../database/Models/User";

interface Socket extends socketio.Socket{
    oauthId?:string
}

class WebSocket {
  private io: socketio.Server;
  constructor(server: Server, sessionMiddleware: any) {
    this.io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    }).use((socket: Socket, next: any) => {
      if (socket.handshake.query && socket.handshake.query.jwtTok) {
        const token = socket.handshake.query.jwtTok as string;
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
          if (err) {
            return next(new Error("Authentication error"));
          }
          socket.oauthId = decoded.oauthId;
          next();
        });
      } else {
        next(new Error("Authentication error"));
      }
    });
    this.initializeSocketListeners();
  }

  private initializeSocketListeners() {
    this.io.on("connection", (socket: Socket) => {
        if(!this.AuthenticateUserAndDropPreviousConnections(socket.id, socket.oauthId)){
            socket.disconnect();
            return;
        }
        // Friends
        socket.on("add_friend", async ({userId}) => {
            try{
                const user = await sendFriendRequest(socket.oauthId, userId)
                if(user){
                  socket.to(user.socketId).emit("friend_requests", user.friendRequests)
                }
            }catch(err){
                socket.emit("error");
            }
        })
        logger.info(`Incoming socket connection Id: ${socket.id}`);
    });
  }

  private async AuthenticateUserAndDropPreviousConnections(
    socketId: string,
    oauthId: string
  ): Promise<boolean> {
    try {
      const doc = await User.findOneAndUpdate(
        { oauthId },
        { socketId },
        { returnOriginal: true, useFindAndModify: false }
      );
      if (!doc) {
        return false;
      }
      if (doc.socketId) {
        const prevSocket = this.io.sockets.sockets.get(doc.socketId);
        if (prevSocket !== undefined) {
          prevSocket.disconnect();
        }
      }
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
}

export default WebSocket;
