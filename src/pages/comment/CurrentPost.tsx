import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentsList from "./CommentsList";
import CreateComment from "./CreateComment";
import Post from "../main/Post";
import { PostType } from "../../components/types/PostType";
import PreviousPage from "../../components/PreviousPage";

export default function CurrentPost() {
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  const location = useLocation();

  const getPost = async () => {
    setCurrentPost(location.state.currentPost);
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <PreviousPage page="Post" />
      <section className="flex items-center justify-center my-8">
        <div className="flex flex-col items-center justify-center gap-y-5 w-2/5 my-5">
          {currentPost ? <Post key={currentPost.id} {...currentPost} /> : ""}
        </div>
      </section>

      <section className="flex items-center justify-center">
        <div className="w-2/5 flex flex-col items-center justify-center">
          <CommentsList currentPostId={currentPost?.id || ""} />
        </div>
      </section>
      <section>
        <div>
          <CreateComment postId={currentPost?.id || ""} />
        </div>
      </section>
    </>
  );
}
