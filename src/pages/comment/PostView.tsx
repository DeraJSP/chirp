import { useLocation } from "react-router-dom";
import CommentsList from "./CommentsList";
import CreateComment from "./CreateComment";
import PreviousPage from "../../components/PreviousPage";
import PostDetails from "./PostDetails";
import { useState } from "react";

export default function PostView() {
  const location = useLocation();
  const { post, count } = location.state.data;
  const [showForm, setShowForm] = useState(true);

  return (
    <>
      <PreviousPage page="Post" />
      <section className=" flex items-center justify-center my-8">
        <div className="flex flex-col items-center justify-center gap-y-5 w-2/5 my-3">
          {post ? (
            <PostDetails
              key={post.id}
              post={post}
              count={count}
              setShowForm={setShowForm}
            />
          ) : null}
        </div>
      </section>
      <section className="flex items-center justify-center">
        <div className="w-2/5 static z-15 flex flex-col items-center justify-center mb-40">
          <CommentsList post={post} setShowForm={setShowForm} />
        </div>
      </section>
      {showForm == true ? (
        <section>
          <div className="flex justify-center items-center h-full">
            <div className="fixed bottom-0 z-20 w-2/5 pb-3 pt-5 bg-white">
              <CreateComment postId={post.id} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
