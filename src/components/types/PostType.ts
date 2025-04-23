import { Timestamp } from "firebase/firestore";

export interface PostType {
  id: string;
  userId: string;
  username: string;
  content: string;
  userPhoto: string;
  createdAt: Timestamp;
}
