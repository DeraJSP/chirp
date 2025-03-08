import { Timestamp } from "firebase/firestore";

export interface MessageType {
  id: string;
  senderUsername: string;
  senderId: string;
  senderUserPhoto: string;
  recipientId: string;
  recipientUsername: string;
  recipientUserPhoto: string;
  content: string;
  sent: Timestamp;
  read: false;
  likes: string;
}
