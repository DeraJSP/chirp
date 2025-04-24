import { query, collection, where, getDocs } from "firebase/firestore";
import { FriendType } from "../../components/types/FriendType";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import { ProfileType } from "../../components/types/ProfileType";
import { Link } from "react-router-dom";

export default function Friends(props: { profileData: ProfileType }) {
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
      <section>
        <div className="flex flex-col items-center justify-center gap-y-2 p-1 rounded-2xl hover:bg-white hover:border-[1px] hover:border-cGray-100">
          {friendsList?.map((friend) => (
            <div>
              <Link
                to={`/profile/${
                  friend.senderId == profileData.id
                    ? friend.receiverId
                    : friend.senderId
                }`}
                key={friend.id}
              >
                <div className="flex items-center justify-between gap-x-2 text-gray-700">
                  <img
                    src={
                      friend.senderPhoto == profileData.userPhoto
                        ? friend.receiverPhoto
                        : friend.senderPhoto
                    }
                    alt="Friend photo"
                    referrerPolicy="no-referrer"
                    className="rounded-full w-11"
                  />
                  <h1 className="text-lg font-bold">
                    @
                    {friend.senderUsername == profileData.username
                      ? friend.receiverUsername
                      : friend.senderUsername}
                  </h1>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
