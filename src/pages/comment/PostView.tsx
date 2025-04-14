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
      <section className="flex items-center justify-center my-8">
        <div className="flex flex-col items-center justify-center gap-y-5 w-2/5 my-5">
          {post ? (
            <PostDetails key={post.id} post={post} count={count} />
          ) : null}
        </div>
      </section>

      <section className="flex items-center justify-center">
        <div className="w-2/5 flex flex-col items-center justify-center">
          <CommentsList post={post} />
        </div>
      </section>
      <section>
        <div>
          <CreateComment postId={post.id} />
        </div>
      </section>
    </>
  );
}
