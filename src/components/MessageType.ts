import { Timestamp } from "firebase/firestore";

export interface MessageType {
  id: string;
  userId: string;
  username: string;
  description: string;
  userPhoto: string;
  createdAt: Timestamp;
  messageId: string;
}
