import admin from "firebase-admin";
import { Server } from "http";
import socketio from "socket.io";
import logger from "../Logger/Logger";
import jwt from "jsonwebtoken";
import User, {
  acceptFriendRequest,
  getChatList,
  getFriendRequestsSent,
  getFriendsList,
  getSocketId,
  IUser,
  sendFriendRequest,
} from "../database/Models/User";
import Chat, { Message } from "../database/Models/Chat";
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
      if (socket.handshake.query && socket.handshake.query.jwtTok && socket.handshake.query.jwtTok !== "null") {
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
      if (!this.AuthenticateUserAndDropPreviousConnections(socket.id, socket.oauthId)) {
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
            this.io.to(user.socketId).emit("friend_requests", user.friendRequests);
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
          const user = await User.findOne({ oauthId: socket.oauthId }).populate("friendRequests.user");
          const index = user.friendRequests.findIndex((request) => request.user.oauthId == userId);
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

      socket.on("send_message", async (chatId, msg) => {
        try {
          const chat = await Chat.findById(chatId).populate("participants.user");
          const user = await User.findOne({ oauthId: socket.oauthId });
          msg.sentBy = user._id;
          msg.readBy = [user._id];
          const message = new Message(msg);
          var incrementParticipantsUnreadQuery: any = {};
          chat.participants.forEach((participant, i) => {
            if (!participant.user._id.equals(user._id)) {
              incrementParticipantsUnreadQuery[`participants.${i}.unread`] = 1;
            }
          });
          await Chat.updateOne(
            { _id: chat._id },
            {
              $push: { messages: { $each: [message._id], $position: 0 } },
              $inc: incrementParticipantsUnreadQuery,
            }
          );
          await message.save();
          chat.participants.forEach((participant) => {
            this.io.to(participant.user.socketId).emit("receive_message", chatId, {
              ...message.toObject(),
              createdAt: Date.now(),
              replyTo: msg.replyTo,
            });
          });
        } catch (error) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(error, { service: "socket.send_message" });
        }
      });

      socket.on("get_messages", async (chatId, skip = 0) => {
        try {
          const chat = await Chat.findById(chatId, {
            messages: { $slice: [skip, 100] },
          }).populate({ path: "messages", populate: { path: "replyTo" } });
          socket.emit("messages", chat.messages);
        } catch (error) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(error, { service: "socket.get_chat_details" });
        }
      });

      socket.on("acknowledge_messages", async (chatId: string, messageIds: string[]) => {
        try {
          const user = await User.findOne({ oauthId: socket.oauthId });
          const messagesAck = await Message.updateMany({ _id: { $in: messageIds } }, { $addToSet: { readBy: user } });
          const chat = await Chat.findById(chatId).populate("participants.user");
          const participantIndex = chat.participants.findIndex((participant) => participant.user.oauthId === socket.oauthId);
          const setIndexQuery = `participants.${participantIndex}.unread`;
          await Chat.updateOne({ _id: chat._id }, { $inc: { [setIndexQuery]: -messagesAck.nModified } });
          chat.participants.forEach((participant, i) => {
            this.io.to(participant.user.socketId).emit("message_acks", chatId, messageIds, user._id);
          });
        } catch (error) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(error, { service: "socket.acknowledge_messages" });
        }
      });

      socket.on("get_chat_details", async (chatId) => {
        try {
          var chat = null;
          if (Types.ObjectId.isValid(chatId)) {
            chat = await Chat.findById(chatId, "-messages").populate("participants.user", "name avatarUrl online lastSeen oauthId");
          }
          socket.emit("chat_details", chat);
        } catch (error) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(error, { service: "socket.get_chat_details" });
        }
      });

      socket.on("is_typing", async (chatId, isTyping) => {
        try {
          const chat = await Chat.findById(chatId, "-messages").populate("participants.user");
          chat.participants.forEach((participant) => {
            if (participant.user.oauthId !== socket.oauthId)
              this.io.to(participant.user.socketId).emit("is_typing", chatId, socket.oauthId, isTyping);
          });
        } catch (error) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(error, { service: "socket.is_typing" });
        }
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
            { oauthId: socket.oauthId, socketId: socket.id },
            { online: false, lastSeen: Date.now() },
            { useFindAndModify: false, returnOriginal: false }
          ).populate("friends.user");
          if (user) this.updateOnlineStatus(user);
        } catch (err) {
          socket.emit("error", { msg: "Internal server error" });
          logger.error(err, { service: "socket.disconnect" });
        }
      });

      // Call
      socket.on("make_call", async (receiverId: string, video: boolean) => {
        const socketId = await getSocketId(receiverId);
        if (socketId) this.io.to(socketId).emit("incoming_call", socket.oauthId, video);
      });

      socket.on("accept_call", async (receiverId: string, data: any) => {
        const socketId = await getSocketId(receiverId);
        if (socketId) this.io.to(socketId).emit("call_accepted", socket.oauthId, data);
      });

      socket.on("signal_data", async (receiverId: string, data: any) => {
        const socketId = await getSocketId(receiverId);
        if (socketId) this.io.to(socketId).emit("signal_data", socket.oauthId, data);
      });

      socket.on("receiver_state", async (receiverId: string, data: any) => {
        const socketId = await getSocketId(receiverId);
        if (socketId) this.io.to(socketId).emit("receiver_state", data);
      });

      socket.on("end_call", async (receiverId: string) => {
        const socketId = await getSocketId(receiverId);
        if (socketId) this.io.to(socketId).emit("end_call");
      });

      socket.on("reject_call", async (receiverId: string) => {
        const socketId = await getSocketId(receiverId);
        if (socketId) this.io.to(socketId).emit("reject_call");
      });

      try {
        const profile = await User.findOneAndUpdate(
          { oauthId: socket.oauthId },
          { online: true },
          { useFindAndModify: false, returnOriginal: false }
        ).populate("friends.user");
        this.updateOnlineStatus(profile);

        admin
          .auth()
          .createCustomToken(socket.oauthId)
          .then((token) => {
            socket.emit("profile", {
              ...profile.toJSON(),
              firebaseToken: token,
            });
          });
      } catch (err) {
        socket.emit("error", { msg: "Authentication error" }, 401);
        logger.error(err, { service: "socket.connect" });
      }

      logger.info(`Incoming socket connection Id: ${socket.id} UserId: ${socket.oauthId}`);
    });
  }

  private async AuthenticateUserAndDropPreviousConnections(socketId: string, oauthId: string): Promise<boolean> {
    try {
      const doc = await User.findOneAndUpdate({ oauthId }, { socketId }, { returnOriginal: true, useFindAndModify: false });
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
