import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import Post from "./Post";
import { CreateForm } from "../create-post/CreateForm";
import { PostType } from "../../components/types/PostType";

export default function Home() {
  const [postList, setPostList] = useState<PostType[] | null>(null);

  const getPost = async () => {
    const postsRef = collection(db, "posts");
    const data = await getDocs(postsRef);

    const postDoc = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PostType[];
    setPostList(postDoc);
  };

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
          {postList?.map((post) => <Post key={post.id} {...post} />)}
        </div>
      </section>
    </>
  );
}
