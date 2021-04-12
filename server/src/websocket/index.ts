import { Server } from "http";
import socketio from "socket.io";
import logger from "../Logger/Logger";
import jwt from "jsonwebtoken";
import User, {
  acceptFriendRequest,
  getFriendsList,
  IUser,
  sendFriendRequest,
} from "../database/Models/User";

interface Socket extends socketio.Socket {
  oauthId?: string;
}

const AuthError = {
  code: 401,
  msg: "Authentication error",
};

class WebSocket {
  private io: socketio.Server;
  constructor(server: Server) {
    this.io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    }).use((socket: Socket, next: any) => {
      if (
        socket.handshake.query &&
        socket.handshake.query.jwtTok &&
        socket.handshake.query.jwtTok !== "null"
      ) {
        const token = socket.handshake.query.jwtTok as string;
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
          if (err) {
            return next(new Error(JSON.stringify(AuthError)));
          }
          socket.oauthId = decoded.oauthId;
          next();
        });
      } else {
        next(new Error(JSON.stringify(AuthError)));
      }
    });
    this.initializeSocketListeners();
  }

  private initializeSocketListeners() {
    this.io.on("connection", async (socket: Socket) => {
      if (
        !this.AuthenticateUserAndDropPreviousConnections(
          socket.id,
          socket.oauthId
        )
      ) {
        socket.disconnect(true);
        return;
      }
      // Friends
      socket.on("get_friends_list", async () => {
        try {
          const friends = await getFriendsList(socket.oauthId);
          socket.emit("friends_list", friends);
        } catch (err) {
          socket.emit("error");
        }
      });

      socket.on("add_friend", async ({ userId }) => {
        try {
          const user = await sendFriendRequest(socket.oauthId, userId);
          if (user) {
            socket.emit("success", "Friend request sent")
            this.io
              .to(user.socketId)
              .emit("friend_requests", user.friendRequests);
          }else{
            socket.emit("error", "UserId not found");
          }
        } catch (err) {
          socket.emit("error");
          logger.error(err, { service: "socket.add_friend" });
        }
      });

      socket.on("accept_friend_request", async ({ userId }) => {
        try {
          const { user } = await acceptFriendRequest(userId, socket.oauthId);
          if (user) {
            const userFriends = await getFriendsList(user.oauthId);
            const toUserFriends = await getFriendsList(socket.oauthId);
            socket.to(user.socketId).emit("friends_list", userFriends);
            socket.emit("friends_list", toUserFriends);
          }
        } catch (err) {
          socket.emit("error");
          logger.error(err, { service: "socket.accept_friend_request" });
        }
      });

      socket.on("disconnect", async () => {
        try {
          const user = await User.findOneAndUpdate(
            { oauthId: socket.oauthId },
            { online: false, lastSeen: Date.now() },
            { useFindAndModify: false, returnOriginal: false }
          ).populate("friends.user");
          this.updateOnlineStatus(user);
        } catch (err) {
          socket.emit("error");
          logger.error(err, { service: "socket.disconnect" });
        }
      });

      const profile = await User.findOneAndUpdate(
        { oauthId: socket.oauthId },
        { online: true },
        { useFindAndModify: false, returnOriginal: false }
      ).populate("friends.user");
      this.updateOnlineStatus(profile);
      socket.emit("profile", profile);

      logger.info(
        `Incoming socket connection Id: ${socket.id} UserId: ${socket.oauthId}`
      );
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
          prevSocket.disconnect(true);
        }
      }
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  private updateOnlineStatus(user: IUser) {
    user.friends.forEach((friend) => {
      this.io.to(friend.user.socketId).emit("update_friend_status", {
        oauthId: user.oauthId,
        online: user.online,
        lastSeen: user.lastSeen,
      });
    });
  }
}

export default WebSocket;
