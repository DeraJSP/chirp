import { Timestamp } from "firebase/firestore";

export interface CommentType {
  id: string;
  userId: string;
  username: string;
  content: string;
  userPhoto: string;
  date: Timestamp;
  postId: string;
}
