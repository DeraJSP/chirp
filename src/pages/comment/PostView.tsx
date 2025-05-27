import { useLocation } from "react-router-dom";
import CommentsList from "./CommentsList";
import CreateComment from "./CreateComment";
import PreviousPage from "../../components/PreviousPage";
import PostDetails from "./PostDetails";
import { useState } from "react";

export default function PostView() {
  const location = useLocation();
  const { post, count } = location.state.data;
  const [showForm, setShowCommentForm] = useState(true);

  return (
    <>
      <PreviousPage page="Post" />
      <section className=" flex items-center justify-center my-8">
        <div className="flex flex-col items-center justify-center gap-y-5 w-1/3 my-3">
          {post ? (
            <PostDetails
              key={post.id}
              post={post}
              count={count}
              setShowCommentForm={setShowCommentForm}
            />
          ) : null}
        </div>
      </section>
      <section className="flex items-center justify-center">
        <div className="w-1/3 static z-15 flex flex-col items-center justify-center mb-40">
          <CommentsList post={post} setShowCommentForm={setShowCommentForm} />
        </div>
      </section>
      {showForm && (
        <section>
          <div className="flex justify-center items-center h-full">
            <div className="fixed bottom-0 z-20 w-1/3 pb-3 pt-5 bg-white">
              <CreateComment postId={post.id} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
