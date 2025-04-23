import { Timestamp } from "firebase/firestore";

export interface FriendType {
  id: string;
  senderId: string;
  senderUsername: string;
  senderPhoto: string;
  receiverId: string;
  receiverUsername: string;
  receiverPhoto: string;
  status: "pending" | "accepted";
  userIdPair: string;
  sentAt: Timestamp;
}
