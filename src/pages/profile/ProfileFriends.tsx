import { query, collection, where, getDocs } from "firebase/firestore";
import { FriendType } from "../../components/types/FriendType";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import { ProfileType } from "../../components/types/ProfileType";
import Friend from "./Friend";

export default function ProfileFriends(props: { profileData: ProfileType }) {
  const { profileData } = props;
  const [friendsList, setFriendsList] = useState<FriendType[] | null>(null);

  const getFriends = async () => {
    try {
      const querySnapshot = query(
        collection(db, "friends"),
        where("friendship", "array-contains", profileData.id),
        where("status", "==", "accepted")
      );
      const data = await getDocs(querySnapshot);
      const friendDoc = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FriendType[];
      setFriendsList(friendDoc);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <>
      {friendsList?.map((friend) => (
        <Friend friend={friend} profileData={profileData} />
      ))}
    </>
  );
}
