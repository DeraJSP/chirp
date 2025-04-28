import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import ViewLikes from "../pages/main/ViewLikes";
import like from "../pages/main/img/like.svg";
import unlike from "../pages/main/img/unlike.svg";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  // getDocFromCache,
  getDocs,
  // getDocsFromCache,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { LikeType } from "./types/LikeType";
import useFetchDoc from "./hooks/useFetchDoc";

export default function Like(props: { docId: string }) {
  const { docId } = props;
  const [user] = useAuthState(auth);
  const [isVisible, setIsVisible] = useState(false);
  const {
    data: likes,
    setData: setLikes,
    getDoc: getLikes,
  } = useFetchDoc<LikeType>("likes");

  const addLike = async () => {
    try {
      const likesRef = collection(db, `likes`);
      await addDoc(likesRef, {
        userId: user?.uid,
        likeId: docId,
        username: user?.displayName,
        userPhoto: user?.photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeLike = async () => {
    try {
      const querySnapshot = query(
        collection(db, "likes"),
        where("likeId", "==", docId),
        where("userId", "==", user?.uid)
      );
      const data = await getDocs(querySnapshot);
      await deleteDoc(doc(db, `likes`, data.docs[0].id));
    } catch (err) {
      console.error(err);
    }
  };

  // const getCacheLikes = async () => {
  //   try {
  //     const querySnapshot = query(
  //       collection(db, "likes"),
  //       where("likeId", "==", docId)
  //     );
  //     const data = await getDocsFromCache(querySnapshot);
  //     const docData = data.docs.map((doc) => ({
  //       ...doc.data(),
  //     })) as LikeType[];
  //     setLikes(docData);
  //     // setLikes((prevDocs) => [...(prevDocs || []), ...docData]);
  //     console.log(likes);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
  //         const messagesDoc = snapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         })) as MessageType[];
  //         setConvoMessages(messagesDoc);
  //       });

  //       const getCacheLikes = async () => {
  //         try {
  //           const querySnapshot = query(
  //             collection(db, "likes"),
  //             where("likeId", "==", docId)
  //           );
  //           const data = await getDocsFromCache(querySnapshot);
  //           const docData = data.docs.map((doc) => ({
  //             ...doc.data(),
  //           })) as LikeType[];
  //           setLikes(docData);
  //         } catch (error) {
  //           console.error(error);
  //         }
  //       };

  const getCacheLikes = async () => {
    try {
      const querySnapshot = query(
        collection(db, "likes"),
        where("likeId", "==", docId)
      );
      const unsubscribe = onSnapshot(
        querySnapshot,
        // { source: "cache" },
        (snapshot) => {
          const docData = snapshot.docs.map((doc) => ({
            ...doc.data(),
          })) as LikeType[];

          // setLikes((prevDocs) => [...(prevDocs || []), ...docData]);
          setLikes(docData);
        }
      );
      // console.log(likes);

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);
  useEffect(() => {
    getLikes("likeId", docId);
  }, []);
  return (
    <>
      <div className="flex items-center justify-center gap-x-2">
        <button
          onClick={
            hasUserLiked
              ? () => {
                  removeLike();
                  getCacheLikes();
                }
              : () => {
                  addLike();
                  getCacheLikes();
                }
          }
        >
          {hasUserLiked ? (
            <>
              <img src={like} alt="like" className="w-5" />
            </>
          ) : (
            <>
              <img src={unlike} alt="unlike" className="w-5" />
            </>
          )}
        </button>
        {likes && (
          <>
            <button onClick={() => setIsVisible(!isVisible)}>
              <p className="text-gray-600">{likes?.length}</p>
            </button>
          </>
        )}
      </div>
      <div>
        <ViewLikes trigger={isVisible} setTrigger={setIsVisible}>
          {likes?.map((like) => <p key={like.likeId}>{like?.username}</p>)}
        </ViewLikes>
      </div>
    </>
  );
}
