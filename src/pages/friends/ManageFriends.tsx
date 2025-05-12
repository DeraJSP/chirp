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
import Request from "./Request";

export default function ManageFriends() {
  const [friendsList, setFriendsList] = useState<FriendType[] | null>(null);
  const [requestsList, setRequestsList] = useState<FriendType[] | null>(null);
  const [toggleState, setToggleState] = useState(1);

  const [user] = useAuthState(auth);

  const getRequests = async () => {
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
      setRequestsList(requestDoc);
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

  const getCacheDoc = () => {
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
  }, [user?.uid]);

  useEffect(() => {
    getRequests();
  }, [user?.uid]);

  useEffect(() => {
    const unsubscribe = getCacheDoc();
    if (unsubscribe) {
      return () => unsubscribe();
    }
  }, []);

  return (
    <>
      {/* {" "}
      <section>
        <h1>Friend Requests</h1>
        {requests?.map((request) => (
          <Request key={request.id} request={request} />
        ))}
      </section>
      <section>
        <h1>Friend List</h1>
        {friendsList?.map((friend) => (
          <Friend key={friend.id} friend={friend} />
        ))}
      </section> */}
      <section className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-5 w-2/5 my-10">
          <div className="flex justify-center gap-x-10">
            <button
              onClick={() => setToggleState(1)}
              className={
                toggleState === 1
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
              onClick={() => setToggleState(2)}
              className={
                toggleState === 2
                  ? "flex justify-center w-18 border-b-4 border-cBlue-200 p-2 font-bold text-gray-800 hover:bg-gray-200-rounded-xl"
                  : "p-2 font-bold text-gray-500 hover:bg-gray-200 hover:rounded-xl"
              }
            >
              <p>
                Requests
                {requestsList?.length || 0 > 0 ? (
                  <>({requestsList?.length})</>
                ) : null}
              </p>
            </button>
          </div>
          {toggleState === 1 ? (
            <div className="w-full">
              {friendsList?.map((friend) => (
                <Friend key={friend.id} friend={friend} />
              ))}
            </div>
          ) : (
            <div className="w-full">
              {requestsList?.map((request) => (
                <Request key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
