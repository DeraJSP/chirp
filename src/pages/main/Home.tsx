import { getDocs, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect } from "react";
import Post from "./Post";
import { CreateForm } from "../create-post/CreateForm";
import { PostType } from "../../components/types/PostType";
import useFetchDoc from "../../components/hooks/useFetchDoc";

export default function Home() {
  const {
    data: postList,
    setData: setPostList,
    // getCacheDoc,
  } = useFetchDoc<PostType>("posts");

  const getPost = async () => {
    const postsRef = collection(db, "posts");
    const snapshot = await getDocs(postsRef);

    const postDoc = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PostType[];
    setPostList(postDoc);
  };

  const getCacheDoc = () => {
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
    const unsubscribe = getCacheDoc();
    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log("clean up ran");
      }
    };
  }, []);

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <section>
        <CreateForm />
      </section>
      <section className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-5 w-2/5 my-10">
          {postList?.map((post) => <Post key={post.id} post={post} />)}
        </div>
      </section>
    </>
  );
}
