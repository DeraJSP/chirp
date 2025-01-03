import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Post as IPost } from "./Home";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props {
  post: IPost;
}

interface Like {
  likeId: string;
  userId: string;
}

export default function Post(props: Props) {
  const { post } = props;
  const [user] = useAuthState(auth);

  // store the number of likes

  const [likes, setLikes] = useState<Like[] | null>(null);

  const likesRef = collection(db, "likes");

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, likeId: newDoc.id }]
            : [{ userId: user?.uid, likeId: newDoc.id }]
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
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const delData = await getDocs(delLikeQuery);
      const likeId = delData.docs[0].id;
      const delLike = doc(db, "likes", delData.docs[0].id);
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

  const likesDoc = query(likesRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);

    // set the state to the userId of likers
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  // run the getLikes function
  useEffect(() => {
    getLikes();
  }, []);

  return (
    <>
      <div>
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <p>by @{post.username}</p>

        <button onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <>&#x1F90D;</> : <>&#x1F49C;</>}
          {likes && <> {likes?.length}</>}
        </button>
      </div>
    </>
  );
}
