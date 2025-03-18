import Comment from "./Comment";
import { CommentType } from "../../components/types/CommentType";
import useFetchDoc from "../../components/hooks/useFetchDoc";

export default function CommentsList(props: { currentPostId: string }) {
  const { currentPostId } = props;

  const { data: comments } = useFetchDoc<CommentType>(
    "comments",
    "postId",
    currentPostId,
    currentPostId
  );

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-gray-700">Comments</h2>
      {comments?.map((comment) => <Comment key={comment.id} {...comment} />)}
    </>
  );
}
