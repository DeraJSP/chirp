import { useEffect, useState } from "react";
import { FriendType } from "../../components/types/FriendType";
import { auth, db } from "../../config/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Friend from "./Friend";
import SingleRequest from "./SingleRequest";

export default function ManageFriends() {
  const [friendsList, setFriendsList] = useState<FriendType[] | null>(null);
  const [friendRequest, setFriendRequest] = useState<FriendType[] | null>(null);
  const [toggleTabState, setToggleTabState] = useState(1);
  const [user] = useAuthState(auth);

  const getFriendRequest = async () => {
    try {
      const requestQuery = query(
        collection(db, `friends`),
        where("status", "==", "pending"),
        where("receiverId", "==", user?.uid || "")
      );
      const data = await getDocs(requestQuery);
      const requestDoc = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FriendType[];
      setFriendRequest(requestDoc);
    } catch (error) {
      console.error(error);
    }
  };

  const getRequestsFromCache = () => {
    try {
      const friendsRef = collection(db, "friends");
      const querySnapshot = query(
        friendsRef,
        where("status", "==", "pending"),
        where("receiverId", "==", user?.uid || "")
      );
      const unsubscribe = onSnapshot(
        querySnapshot,
        { source: "cache" },
        (snapshot) => {
          const requestDoc = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as FriendType[];
          setFriendRequest(requestDoc);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error(error);
    }
  };

  const getFriends = async () => {
    try {
      const querySnapshot = query(
        collection(db, "friends"),
        where("friendship", "array-contains", user?.uid || ""),
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

  const getFriendsFromCache = () => {
    try {
      const friendsRef = collection(db, "friends");
      const querySnapshot = query(
        friendsRef,
        where("friendship", "array-contains", user?.uid || ""),
        where("status", "==", "accepted")
      );
      const unsubscribe = onSnapshot(
        querySnapshot,
        { source: "cache" },
        (snapshot) => {
          const friendDoc = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as FriendType[];
          setFriendsList(friendDoc);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFriends();
    console.log("friendsList", friendsList);
  }, [user?.uid]);

  useEffect(() => {
    const unsubscribe = getFriendsFromCache();
    if (unsubscribe) {
      return () => unsubscribe();
    }
  }, [user?.uid]);

  useEffect(() => {
    getFriendRequest();
  }, [user?.uid]);

  useEffect(() => {
    const unsubscribe = getRequestsFromCache();
    if (unsubscribe) {
      return () => unsubscribe();
    }
  }, [user?.uid]);

  return (
    <>
      <section className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-5 w-1/3 my-10">
          <div className="flex justify-center gap-x-10">
            <button
              onClick={() => setToggleTabState(1)}
              className={
                toggleTabState === 1
                  ? "flex justify-center w-18 border-b-4 border-cBlue-200 p-2 font-bold text-gray-800"
                  : "p-2 font-bold text-gray-500 hover:bg-gray-200 hover:rounded-xl"
              }
            >
              <p>
                Friends
                {friendsList?.length || 0 > 0 ? (
                  <>({friendsList?.length})</>
                ) : null}
              </p>
            </button>
            <button
              onClick={() => setToggleTabState(2)}
              className={
                toggleTabState === 2
                  ? "flex justify-center w-18 border-b-4 border-cBlue-200 p-2 font-bold text-gray-800 hover:bg-gray-200-rounded-xl"
                  : "p-2 font-bold text-gray-500 hover:bg-gray-200 hover:rounded-xl"
              }
            >
              <p>
                Requests
                {friendRequest?.length || 0 > 0 ? (
                  <>({friendRequest?.length})</>
                ) : null}
              </p>
            </button>
          </div>
          {toggleTabState === 1 ? (
            <div className="flex flex-col w-full">
              {friendsList?.map((friend) => (
                <Friend key={friend.id} friend={friend} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {friendRequest?.map((request) => (
                <SingleRequest key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
