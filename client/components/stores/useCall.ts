// import create, { State } from "zustand";
// import { combine, devtools } from "zustand/middleware";
// import { useContext, useEffect } from "react";
// import { WebSocketContext } from "../providers/WebSocketProvider";
// import { IUser } from "./useProfile";
// import useChatList from "./useChatList";
// import { IChatListItem } from "../modules/ChatList/ChatListItem";
// import useMediaStream, { useMediaStreamState } from "./call/useMediaStream";
// import useMediaConfigurations from "./call/useMediaConfiguration";
// import Peer from "simple-peer";
// import { Socket } from "socket.io-client";

// type CallStatus = "idle" | "call" | "call_outgoing" | "call_incoming" | "call_rejected";
// export type RejectReason = "BUSY" | "REJECT";

// interface CallUserState {
//   audio: boolean;
//   deafened: boolean;
//   video: boolean;
// }

// interface IUseCallStateProps extends State {
//   userState: CallUserState;
//   rejectReason: RejectReason;
//   callStatus: CallStatus;
//   receiverId: string;
//   receiverProfile: IUser;
//   receiverStream: MediaStream;
//   receiverState: CallUserState;
//   peer: Peer.Instance;
// }

// interface IUseCallState extends IUseCallStateProps {
//   setReceiverId: (receiverId: string) => void;
//   setReceiverProfile: (receiverProfile: IUser) => void;
//   setStatus: (status: CallStatus) => void;
//   setRejectReason: (rejectReason: RejectReason) => void;
//   setReceiverStream: (receiverStream: MediaStream) => void;
//   setPeer: (peer: Peer.Instance) => void;
//   setReceiverState: (receiverState: CallUserState) => void;
//   setUserState: (userState: CallUserState) => void;
//   resetCallState: () => void;
// }

// const initialState: IUseCallStateProps = {
//   userState: {
//     audio: true,
//     video: false,
//     deafened: false,
//   },
//   rejectReason: null,
//   callStatus: "idle",
//   receiverId: null,
//   receiverProfile: null,
//   receiverStream: null,
//   peer: null,
//   receiverState: {
//     audio: true,
//     video: false,
//     deafened: false,
//   },
// };

// const useCallState = create<IUseCallState>(
//   devtools(
//     combine(initialState, (set) => ({
//       setReceiverId: (receiverId: string) => set({ receiverId }),
//       setStatus: (status: CallStatus) => set({ callStatus: status }),
//       setRejectReason: (rejectReason: RejectReason) => set({ rejectReason }),
//       setReceiverProfile: (receiverProfile: IUser) => set({ receiverProfile }),
//       setReceiverStream: (receiverStream: MediaStream) => set({ receiverStream }),
//       setPeer: (peer: Peer.Instance) => set({ peer }),
//       setReceiverState: (receiverState: CallUserState) => set({ receiverState }),
//       setUserState: (userState: CallUserState) => set({ userState }),
//       resetCallState: () => {
//         set({
//           receiverState: {
//             audio: false,
//             video: false,
//             deafened: false,
//           },
//           userState: {
//             audio: false,
//             video: false,
//             deafened: false,
//           },
//         });
//       },
//     }))
//   )
// );

// export const findUserFromChat = (chats: IChatListItem[], userId: string) => {
//   if (!chats) return null;
//   const chat = chats.find((chat) => {
//     return chat.chat.participants[0].user.oauthId === userId && chat.chat.type === "personal";
//   });
//   if (chat) return chat.chat.participants[0].user;
//   else return null;
// };

// const useCall = () => {
//   const callState = useCallState();
//   const mediaConfig = useMediaConfigurations();
//   const { socket } = useContext(WebSocketContext);
//   const { chats } = useChatList();
//   const { waitForMediaStream, mediaStream } = useMediaStream();

//   useEffect(() => {
//     if (socket)
//       socket.emit("receiver_state", callState.receiverId, {
//         ...callState.userState,
//         audio: callState.userState.audio && mediaConfig.hasAudio,
//         video: callState.userState.video && mediaConfig.hasVideo,
//       });
//     if (mediaStream) {
//       mediaStream.getVideoTracks().forEach((track) => (track.enabled = callState.userState.video && mediaConfig.hasVideo));
//       mediaStream.getAudioTracks().forEach((track) => (track.enabled = callState.userState.audio && mediaConfig.hasAudio));
//     }
//   }, [callState.userState, mediaStream]);

//   useEffect(() => {
//     if (callState.callStatus !== "call_outgoing" && callState.callStatus !== "call") {
//       if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop());
//       if (callState.peer) {
//         callState.peer.destroy();
//         callState.setPeer(null);
//         callState.setReceiverStream(null);
//       }
//     }
//   }, [callState.callStatus]);

//   const make_peer_call = async () => {
//     const stream = await getMediaStream();
//     const newPeer = new Peer({ initiator: true, stream: stream });
//     return newPeer;
//   };

//   const rejectCall = (reason: RejectReason, receiverId?: string) => {
//     socket.emit("reject_call", receiverId ?? callState.receiverId, reason);
//     callState.setReceiverId(null);
//   };

//   const acceptCall = async (video: boolean) => {
//     try {
//       const newPeer = await make_peer_call();
//       callState.setUserState({
//         audio: false,
//         video: video,
//         deafened: false,
//       });
//       newPeer.on("signal", (signalData) => {
//         const { callStatus, receiverId, setStatus } = useCallState.getState();
//         if (callStatus === "call_incoming") {
//           socket.emit("accept_call", receiverId, signalData);
//           setStatus("call");
//         } else {
//           socket.emit("signal_data", receiverId, signalData);
//         }
//       });
//       newPeer.on("stream", (stream: MediaStream) => {
//         callState.setReceiverStream(stream);
//       });
//       newPeer.on("error", (error) => {
//         console.error(error);
//       });
//       callState.setPeer(newPeer);
//     } catch (error) {}
//   };

//   const cancelCall = () => {
//     callState.setStatus("idle");
//     callState.setReceiverId(null);
//   };

//   const makeCall = async (receiverId: string, video: boolean = false) => {
//     socket.emit("make_call", receiverId, video);
//     callState.setStatus("call_outgoing");
//     callState.setReceiverId(receiverId);
//     callState.setReceiverProfile(findUserFromChat(chats, receiverId));
//     callState.setUserState({
//       audio: true,
//       video,
//       deafened: false,
//     });
//     getMediaStream();
//   };

//   const callAccepted = async (socket: Socket, receiverId: string, signalData: Peer.SignalData) => {
//     const callState = useCallState.getState();
//     const { mediaStream } = useMediaStreamState.getState();
//     if (receiverId !== callState.receiverId) return;
//     try {
//       const newPeer = new Peer({ initiator: false, stream: mediaStream });
//       newPeer.signal(signalData);
//       newPeer.on("signal", (data) => {
//         const callState = useCallState.getState();
//         socket.emit("signal_data", receiverId, data);
//         if (callState.callStatus === "call_outgoing") {
//           callState.setStatus("call");
//         }
//       });
//       newPeer.on("stream", (stream: MediaStream) => {
//         callState.setReceiverStream(stream);
//       });
//       newPeer.on("error", (error) => {
//         console.error(error);
//       });
//       callState.setPeer(newPeer);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const receiveSignalData = (_receiverId: string, signalData: Peer.SignalData) => {
//     const { peer } = useCallState.getState();
//     if (peer) peer.signal(signalData);
//   };

//   const updateReceiverState = (receiverState: CallUserState) => {
//     callState.setReceiverState(receiverState);
//   };

//   const onCallDisconnect = (msg) => {
//     const callState = useCallState.getState();
//     if (!msg.online) {
//       if (callState.receiverId === msg.oauthId) {
//         switch (callState.callStatus) {
//           case "call":
//             callState.setStatus("idle");
//             break;
//           case "call_incoming":
//             callState.setStatus("idle");
//             callState.setReceiverId(null);
//             callState.setReceiverProfile(null);
//             break;
//           case "call_outgoing":
//             callState.setStatus("idle");
//             break;
//         }
//         callState.resetCallState();
//       }
//     }
//   };

//   return {
//     callState,
//     rejectCall,
//     acceptCall,
//     cancelCall,
//     makeCall,
//     callAccepted,
//     receiveSignalData,
//     onCallDisconnect,
//     updateReceiverState,
//   };
// };

export default {};
