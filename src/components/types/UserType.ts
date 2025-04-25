import { Timestamp } from "firebase/firestore";

export interface UserType {
  id: string;
  email: string;
  username: string;
  userPhoto: string;
  bio: string;
  location: string;
  birthday: string;
  joinedAt: Timestamp;
}
