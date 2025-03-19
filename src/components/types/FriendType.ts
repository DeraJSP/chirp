import { Timestamp } from "firebase/firestore";

export interface FriendType {
  id: string;
  senderId: string;
  recieverId: string;
  accepted: boolean;
  createdAt: Timestamp;
  senderUsername: string;
  senderPhoto: string;
}
