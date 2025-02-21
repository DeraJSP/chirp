import { useState } from "react";
import { FriendType } from "../../components/FriendType";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export default function Friends() {
  const [friendsList, setFriendsList] = useState<FriendType[] | null>(null);
  const [requestsList, setRequestsList] = useState<FriendType[] | null>(null);

  const [user] = useAuthState(auth);

  const getFriend = async () => {
    try {
      const requestQuery = query(
        collection(db, `users/${user?.uid}/friends`),
        where("accepted", "==", true)
      );
      const data = await getDocs(requestQuery);
      const friendDoc = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FriendType[];
      setFriendsList(friendDoc);
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const requestStatus = async () => {
    try {
      const requestQuery = query(
        collection(db, `users/${user?.uid}/friends`),
        where("accepted", "==", false)
      );
      const data = await getDocs(requestQuery);
      const friendDoc = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FriendType[];
      setRequestsList(friendDoc);
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const acceptRequest = async (requestId: string, senderUid: string) => {
    const senderRef = collection(db, `users/${user?.uid}/friends`);
    const receieverRef = collection(db, `users/${senderUid}/friends`);
    const refArr = [senderRef, receieverRef];
    await Promise.all(
      refArr?.map(async (ref) => {
        const friendDoc = doc(ref, `users/${user?.uid}/friends`, requestId);
        await updateDoc(friendDoc, {
          accepted: true,
        });
      })
    );
  };

  const rejectRequest = async (requestId: string, senderUid: string) => {
    try {
      const senderRef = collection(db, `users/${user?.uid}/friends`);
      const receieverRef = collection(db, `users/${senderUid}/friends`);
      const refArr = [senderRef, receieverRef];
      await Promise.all(
        refArr?.map(async (ref) => {
          await deleteDoc(doc(ref, `users/${user?.uid}/friends`, requestId));
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {requestsList?.map((request) => (
        <div>
          <img src={request.senderPhoto} alt="" />
          <p>{request.senderUsername}</p>
          <button onClick={() => acceptRequest(request.id, request.senderId)}>
            Accept
          </button>
          <button onClick={() => rejectRequest(request.id, request.senderId)}>
            Reject
          </button>
        </div>
      ))}
    </>
  );
}
