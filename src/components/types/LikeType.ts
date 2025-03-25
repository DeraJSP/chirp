import { Timestamp } from "firebase/firestore";

export interface LikeType {
  likeId: string;
  userId: string;
  username: string;
  userPhoto: string;
  createdAt: Timestamp;
}
