import { getDocs, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect } from "react";
import Post from "./Post";
import { PostType } from "../../components/types/PostType";
import useFetchDoc from "../../components/hooks/useFetchDoc";

export default function Home() {
  const { data: postList, setData: setPostList } =
    useFetchDoc<PostType>("posts");

  const getPost = async () => {
    const postsRef = collection(db, "posts");
    const snapshot = await getDocs(postsRef);

    const postDoc = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PostType[];
    setPostList(postDoc);
  };

  const getPostFromCache = () => {
    try {
      const colRef = collection(db, "posts");
      const unsubscribe = onSnapshot(
        colRef,
        { source: "cache" },
        (snapshot) => {
          const postDoc = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as PostType[];

          setPostList(postDoc);
          console.log("changes added");
        }
      );
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = getPostFromCache();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <section className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-5 w-1/3 my-10">
          {postList?.map((post) => <Post key={post.id} post={post} />)}
        </div>
      </section>
    </>
  );
}
