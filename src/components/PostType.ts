import { Timestamp } from "firebase/firestore";

export interface PostType {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
  userPhoto: string;
  date: Timestamp;
  postId: string;
}
