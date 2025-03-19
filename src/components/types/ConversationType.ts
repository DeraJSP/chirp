import { Timestamp } from "firebase/firestore";

export interface ConversationType {
  id: string;
  senderUsername: string;
  senderId: string;
  senderUserPhoto: string;
  recipientId: string;
  recipientUsername: string;
  recipientUserPhoto: string;
  createdAt: Timestamp;
  role: string;
  lastMessage: { sent: Timestamp; content: string };
}
