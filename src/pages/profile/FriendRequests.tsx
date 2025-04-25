import { auth, db } from "../../config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import addfriend from "./img/add_friend.svg";
import { useAuthState } from "react-firebase-hooks/auth";
import { ProfileType } from "../../components/types/ProfileType";
import { FriendType } from "../../components/types/FriendType";

export default function FriendRequests(props: { profileData: ProfileType }) {
  const { profileData } = props;
  const [friend, setFriend] = useState<FriendType | null>(null);
  const [user] = useAuthState(auth);

  const usersIdArr = [user?.uid, profileData?.id];
  const userIdPair = usersIdArr.sort().join("");

  const getFriends = async () => {
    try {
      const friendsRef = collection(db, "friends");
      const querySnapshot = query(
        friendsRef,
        where("userIdPair", "==", usersIdArr.sort().join(""))
      );
      const docSnap = await getDocs(querySnapshot);
      const friendDoc = docSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FriendType[];
      setFriend(friendDoc[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getCacheDoc = () => {
    try {
      const friendsRef = collection(db, "friends");
      const querySnapshot = query(
        friendsRef,
        where("userIdPair", "==", userIdPair)
      );
      const unsubscribe = onSnapshot(
        querySnapshot,
        { source: "cache" },
        (snapshot) => {
          const friendDoc = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as FriendType[];
          setFriend(friendDoc[0]);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  const checkRequest = () => {
    try {
      switch (friend?.status) {
        case "accepted":
          return "Unfriend";
        case "pending":
          return friend?.senderId == user?.uid
            ? "Cancel Request"
            : "Accept Request";
        default:
          return "Add Friend";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelRequest = async () => {
    try {
      const friendsRef = collection(db, "friends");
      const querySnapshot = query(
        friendsRef,
        where("userIdPair", "==", userIdPair)
      );
      const docSnap = await getDocs(querySnapshot);
      deleteDoc(doc(db, "friends", docSnap.docs[0].id));
    } catch (error) {
      console.error(error);
    }
  };

  const acceptRequest = async () => {
    try {
      const friendsRef = collection(db, "friends");
      const querySnapshot = query(
        friendsRef,
        where("userIdPair", "==", userIdPair)
      );
      const docSnap = await getDocs(querySnapshot);
      const friendDoc = doc(db, "friends", docSnap.docs[0].id);
      await updateDoc(friendDoc, {
        status: "accepted",
        acceptedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const sendRequest = async () => {
    try {
      const friendsRef = collection(db, `friends`);

      await setDoc(doc(friendsRef), {
        senderId: user?.uid,
        senderUsername: user?.displayName,
        senderPhoto: user?.photoURL,
        receiverId: profileData?.id,
        receiverUsername: profileData?.username,
        receieverPhoto: profileData?.userPhoto,
        userIdPair: userIdPair,
        friendship: [user?.uid, profileData?.id],
        status: "pending",
        sentAt: serverTimestamp(),
        acceptedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = getCacheDoc();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    getFriends();
  }, [profileData.id]);

  return (
    <>
      <button
        onClick={
          checkRequest() == "Add Friend"
            ? sendRequest
            : checkRequest() == "Unfriend" || checkRequest() == "Cancel Request"
              ? cancelRequest
              : acceptRequest
        }
        className="hover:bg-cBlue-100 border border-cBlue-200 mb-3 px-3 py-1 rounded-xl font-bold text-gray-700"
      >
        <div className="flex items-center gap-x-3">
          <img src={addfriend} alt="Add friend icon" />
          <p>{checkRequest()}</p>
        </div>
      </button>
    </>
  );
}
