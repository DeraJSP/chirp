import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import ViewLikes from "../pages/create-post/ViewLikes";
import like from "./img/like.svg";
import unlike from "./img/unlike.svg";
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

interface Like {
  likeId: string;
  userId: string;
  username: string;
}

// interface User {
//   id: string;
// }

export default function Like(props: { postId: string }) {
  const [user] = useAuthState(auth);

  const [isVisible, setIsVisible] = useState(false);
  const [likes, setLikes] = useState<Like[] | null>(null);

  const likesRef = collection(db, `users/${user?.uid}/likes`);

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: props.postId,
        username: user?.displayName,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [
                ...prev,
                {
                  userId: user?.uid,
                  likeId: newDoc.id,
                  username: user?.displayName || "",
                },
              ]
            : [
                {
                  userId: user?.uid,
                  likeId: newDoc.id,
                  username: user?.displayName || "",
                },
              ]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const delLikeQuery = query(
        likesRef,
        where("postId", "==", props.postId),
        where("userId", "==", user?.uid)
      );

      const delData = await getDocs(delLikeQuery);
      const likeId = delData.docs[0].id;
      const delLike = doc(db, `users/${user?.uid}/likes`, delData.docs[0].id);
      await deleteDoc(delLike);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getLikes = async () => {
    const data = query(
      collectionGroup(db, "likes"),
      where("postId", "==", props.postId)
    );

    const likeData = await getDocs(data);
    const likeDocArr = likeData.docs.map((doc) => ({
      likeId: doc.id,
      ...doc.data(),
    })) as Like[];
    setLikes(likeDocArr);

    // const userColRef = collection(db, "users");
    // const data = await getDocs(userColRef);
    // const userIdArr = data.docs.map((doc) => ({ id: doc.id }));

    // const likeColRef = userIdArr?.map((user) => {
    //   return collection(db, `users/${user.id}/likes`);
    // });

    // const likesDoc = likeColRef?.map((likeCol) => {
    //   return query(likeCol, where("postId", "==", props.postId));
    // });

    // const likeDocArr = [];
    // likeDocArr.push(...likesDoc);

    // const allLikes = await Promise.all(
    //   likeDocArr?.map(async (col) => {
    //     const data = await getDocs(col);
    //     return data.docs.map((doc) => ({
    //       ...doc.data(),
    //     })) as Like[];
    //   })
    // );

    // // set the state to the userId of likers
    // const likeDoc = [];
    // likeDoc.push(...allLikes.flat());
    // setLikes(likeDoc);
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  // run the getLikes function
  useEffect(() => {
    getLikes();
  }, []);

  return (
    <>
      <div className="flex items-center justify-center gap-x-2">
        <button onClick={hasUserLiked ? removeLike : addLike}>
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
