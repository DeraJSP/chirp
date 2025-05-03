import Comment from "./Comment";
import { CommentType } from "../../components/types/CommentType";
import useFetchDoc from "../../components/hooks/useFetchDoc";
import { useEffect } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { PostType } from "../../components/types/PostType";

export default function CommentsList(props: {
  post: PostType;
  setShowForm: (value: boolean) => void;
}) {
  const { post, setShowForm } = props;

  const {
    data: comments,
    setData: setComments,
    // getDoc: getComments,
    // getCacheDoc,
  } = useFetchDoc<CommentType>("comments");

  const getComments = async () => {
    try {
      const querySnapshot = query(
        collection(db, "comments"),
        where("postId", "==", post.id)
      );
      const dataArr = await getDocs(querySnapshot);
      const docData = dataArr.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CommentType[];
      setComments(docData);
    } catch (error) {
      console.error(error);
    }
  };

  const getCacheDoc = () => {
    try {
      const querySnapshot = query(
        collection(db, "comments"),
        where("postId", "==", post.id)
      );
      const unsubscribe = onSnapshot(
        querySnapshot,
        { source: "cache" },
        (snapshot) => {
          const commentDoc = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as CommentType[];
          setComments(commentDoc);
          console.log("changes added");
        }
      );
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  useEffect(() => {
    const unsubscribe = getCacheDoc();
    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log("clean up ran");
      }
    };
  }, []);

  return (
    <>
      <h2 className="mb-4 font-bold text-gray-700">Comments</h2>
      {comments?.map((comment) => (
        <Comment key={comment.id} comment={comment} setShowForm={setShowForm} />
      ))}
    </>
  );
}
