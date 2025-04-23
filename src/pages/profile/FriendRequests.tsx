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
  // const [isLoading, setIsLoading] = useState(true);
  const [user] = useAuthState(auth);

  const usersIdArr = [user?.uid, profileData?.id];
  const userIdPair = usersIdArr.sort().join("");

  const getFriends = async () => {
    try {
      const friendsRef = collection(db, "friends");
      console.log(userIdPair);

      if (profileData?.id) {
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
      } else {
        console.log(profileData?.id);
      }
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
          console.log("changes added");
        }
      );
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  const checkRequest = () => {
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
        status: "pending",
        sentAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCacheDoc();
  }, []);

  useEffect(() => {
    getFriends();
  }, [user?.uid]);
  console.log(friend);

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

// import { auth, db } from "../../config/firebase";
// import {
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   onSnapshot,
//   query,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
//   where,
// } from "firebase/firestore";
// import { useEffect, useState, useCallback } from "react"; // Import useCallback
// import addfriend from "./img/add_friend.svg";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { ProfileType } from "../../components/types/ProfileType";
// import { FriendType } from "../../components/types/FriendType";

// export default function FriendRequests(props: { profileData: ProfileType }) {
//   const { profileData } = props;
//   const [friend, setFriend] = useState<FriendType | null>(null);
//   const [isLoading, setIsLoading] = useState(true); // Add loading state
//   const [user] = useAuthState(auth);

//   const usersIdArr = [user?.uid, profileData?.id];
//   const usersDocId = usersIdArr.sort().join("");

//   const fetchFriendData = useCallback(async () => {
//     // Use useCallback
//     setIsLoading(true);
//     try {
//       const friendsRef = collection(db, "friends");
//       const q = query(
//         friendsRef,
//         where("senderId", "==", user?.uid || "")
//         // where("users", "array-contains", profileData?.id || "")
//       );
//       const docSnap = await getDocs(q);
//       const friendDoc = docSnap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as FriendType[];
//       setFriend(friendDoc[0]);
//     } catch (error) {
//       console.log(error);
//       setFriend(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [profileData?.id, user?.uid]);

//   useEffect(() => {
//     fetchFriendData(); // Initial fetch
//   }, [fetchFriendData]);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(
//       query(
//         collection(db, "friends"),
//         where("users", "array-contains", user?.uid || ""),
//         where("users", "array-contains", profileData?.id || "")
//       ),
//       { source: "cache" },
//       (snapshot) => {
//         const friendDoc = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as FriendType[];
//         setFriend(friendDoc[0]);
//         console.log("Cache changes added");
//       }
//     );
//     return () => unsubscribe(); // Cleanup listener
//   }, [profileData?.id, user?.uid]);

//   const checkRequest = () => {
//     if (isLoading) {
//       return "Loading...";
//     }
//     switch (friend?.status) {
//       case "accepted":
//         return "Unfriend";
//       case "pending":
//         return friend?.senderId === user?.uid
//           ? "Cancel Request"
//           : "Accept Request";
//       default:
//         return "Add Friend";
//     }
//   };

//   const handleButtonClick = () => {
//     const action = checkRequest();
//     if (action === "Add Friend") {
//       sendRequest();
//     } else if (action === "Unfriend" || action === "Cancel Request") {
//       cancelRequest();
//     } else if (action === "Accept Request") {
//       acceptRequest();
//     }
//   };

//   const cancelRequest = async () => {
//     try {
//       const friendsRef = collection(db, "friends");
//       const q = query(
//         friendsRef,
//         where("users", "array-contains", user?.uid || ""),
//         where("users", "array-contains", profileData?.id || "")
//       );
//       const docSnap = await getDocs(q);
//       docSnap.forEach(async (docToDelete) => {
//         await deleteDoc(doc(db, `friends`, docToDelete.id));
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const acceptRequest = async () => {
//     try {
//       const friendsRef = collection(db, "friends");
//       const q = query(
//         friendsRef,
//         where("users", "array-contains", user?.uid || ""),
//         where("users", "array-contains", profileData?.id || "")
//       );
//       const docSnap = await getDocs(q);
//       docSnap.forEach(async (docToUpdate) => {
//         await updateDoc(doc(db, `friends`, docToUpdate.id), {
//           status: "accepted",
//         });
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const sendRequest = async () => {
//     try {
//       const friendsRef = collection(db, `friends`);
//       await setDoc(doc(friendsRef), {
//         // Let Firestore auto-generate the ID
//         senderId: user?.uid,
//         senderUsername: user?.displayName,
//         senderPhoto: user?.photoURL,
//         receiverId: profileData?.id,
//         receiverUsername: profileData?.username,
//         receieverPhoto: profileData?.userPhoto,
//         users: [user?.uid, profileData?.id],
//         status: "pending",
//         sentAt: serverTimestamp(),
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <button
//       onClick={handleButtonClick}
//       className="hover:bg-cBlue-100 border border-cBlue-200 mb-3 px-3 py-1 rounded-xl font-bold text-gray-700"
//       disabled={isLoading && !friend} // Disable button while loading initially
//     >
//       <div className="flex items-center gap-x-3">
//         <img src={addfriend} alt="Add friend icon" />
//         <p>{checkRequest()}</p>
//       </div>
//     </button>
//   );
// }
