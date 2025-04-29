import { useLocation } from "react-router-dom";
import CommentsList from "./CommentsList";
import CreateComment from "./CreateComment";
import PreviousPage from "../../components/PreviousPage";
import PostDetails from "./PostDetails";

export default function PostView() {
  const location = useLocation();
  const { post, count } = location.state.data;
  return (
    <>
      <PreviousPage page="Post" />
      <section className=" flex items-center justify-center my-8">
        <div className="static z-40 flex flex-col items-center justify-center gap-y-5 w-2/5 my-3">
          {post ? (
            <PostDetails key={post.id} post={post} count={count} />
          ) : null}
        </div>
      </section>

      <section className="flex items-center justify-center">
        <div className="w-2/5 flex flex-col items-center justify-center mb-40">
          <CommentsList post={post} />
        </div>
      </section>
      <section className="">
        <div className="flex justify-center items-center h-full static z-10">
          <div className="fixed bottom-0 z-10 w-2/5 pb-3 pt-5 bg-white">
            <CreateComment postId={post.id} />
          </div>
        </div>
      </section>
    </>
  );
}
