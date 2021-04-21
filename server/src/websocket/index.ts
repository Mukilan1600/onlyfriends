import { Server } from "http";
import socketio from "socket.io";
import logger from "../Logger/Logger";
import jwt from "jsonwebtoken";
import User, {
  acceptFriendRequest,
  getChatList,
  getFriendRequestsSent,
  getFriendsList,
  IUser,
  sendFriendRequest,
} from "../database/Models/User";
import Chat from "../database/Models/Chat";
import { Types } from "mongoose";

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
      socket.on("get_friend_requests_sent", async () => {
        try {
          const requests = await getFriendRequestsSent(socket.oauthId);
          if (requests) {
            socket.emit("friend_requests_sent", requests);
          }
        } catch (err) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(err, { service: "socket.get_friend_requests_sent" });
        }
      });

      socket.on("get_friend_requests", async () => {
        try {
          const user = await User.findOne({ oauthId: socket.oauthId }).populate(
            "friendRequests.user",
            "name online lastSeen avatarUrl socketId oauthId"
          );
          if (user) {
            socket.emit("friend_requests", user.friendRequests);
          }
        } catch (err) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(err, { service: "socket.get_friend_requests" });
        }
      });

      socket.on("get_friends_list", async () => {
        try {
          const friends = await getFriendsList(socket.oauthId);
          socket.emit("friends_list", friends);
        } catch (err) {
          socket.emit("error", { msg: "Internal server error" });
        }
      });

      socket.on("add_friend", async ({ username }) => {
        try {
          const user = await sendFriendRequest(socket.oauthId, username);
          if (user) {
            this.io
              .to(user.socketId)
              .emit("friend_requests", user.friendRequests);
            const sentRequests = await getFriendRequestsSent(socket.oauthId);
            socket.emit("friend_requests_sent", sentRequests);
            socket.emit("success", { msg: "Request sent successfully" });
          } else {
            socket.emit("error", {
              msg: "Invalid username or request already sent",
            });
          }
        } catch (err) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(err, { service: "socket.add_friend" });
        }
      });

      socket.on("accept_friend_request", async ({ userId }) => {
        try {
          const { user } = await acceptFriendRequest(userId, socket.oauthId);
          if (user) {
            const userChats = await getChatList(user.oauthId);
            const toUserChats = await getChatList(socket.oauthId);
            socket.to(user.socketId).emit("chat_list", userChats);
            socket.emit("chat_list", toUserChats);
            socket.emit("friend_request_accepted", userId);
          }
        } catch (err) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(err, { service: "socket.accept_friend_request" });
        }
      });

      socket.on("ignore_friend_request", async ({ userId }) => {
        try {
          const user = await User.findOne({ oauthId: socket.oauthId }).populate(
            "friendRequests.user"
          );
          const index = user.friendRequests.findIndex(
            (request) => request.user.oauthId == userId
          );
          if (index !== -1) {
            user.friendRequests[index].ignored = true;
          }
          await user.save();
          socket.emit("friend_requests", user.friendRequests);
        } catch (err) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(err, { service: "socket.ignore_friend_request" });
        }
      });

      // Chats
      socket.on("get_chat_list", async () => {
        try {
          const chats = await getChatList(socket.oauthId);
          if (chats) {
            socket.emit("chat_list", chats);
          }
        } catch (error) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(error, { service: "socket.get_chat_list" });
        }
      });

      socket.on("send_message", async ({ chatId, msg }) => {
        const chat = await Chat.findById(chatId, "-messages").populate(
          "participants"
        );
        chat.messages.push(msg);
        chat.participants.forEach((participant) => {
          this.io
            .to(participant.socketId)
            .emit("receive_message", { chatId, msg });
        });
      });

      socket.on("get_messages", async (chatId, skip = 0) => {
        
        const chat = await Chat.findById(chatId, {
          messages: { $slice: [skip, skip + 50] },
        });
        socket.emit("messages", chat.messages);
      });

      socket.on("get_chat_details", async (chatId) => {
        var chat = null
        if(Types.ObjectId.isValid(chatId)){
          chat = await Chat.findById(chatId, "-messages").populate(
            "participants",
            "name avatarUrl online lastSeen oauthId"
          );
        }
        socket.emit("chat_details", chat);
      });

      //Profile
      socket.on("change_username", async ({ username }) => {
        try {
          const exists = await User.findOne({ username });

          if (exists) socket.emit("error", { msg: "Username is taken" });
          else {
            const user = await User.findOneAndUpdate(
              { oauthId: socket.oauthId },
              { username },
              { useFindAndModify: false, returnOriginal: false }
            ).populate("friends.user");
            socket.emit("profile", user);
            socket.emit("success", { msg: "Username changed successfully" });
          }
        } catch (error) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(error, { service: "socket.change_username" });
        }
      });

      socket.on("disconnect", async () => {
        try {
          const user = await User.findOneAndUpdate(
            { oauthId: socket.oauthId },
            { online: false, lastSeen: Date.now() },
            { useFindAndModify: false, returnOriginal: false }
          ).populate("friends.user");
          if (user) this.updateOnlineStatus(user);
        } catch (err) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(err, { service: "socket.disconnect" });
        }
      });
      try {
        const profile = await User.findOneAndUpdate(
          { oauthId: socket.oauthId },
          { online: true },
          { useFindAndModify: false, returnOriginal: false }
        ).populate("friends.user");
        this.updateOnlineStatus(profile);
        socket.emit("profile", profile);
      } catch (err) {
        socket.emit("error", { msg: "Authentication error" }, 401);
        logger.error(err, { service: "socket.connect" });
      }

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
