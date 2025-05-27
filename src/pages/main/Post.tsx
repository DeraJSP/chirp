import TimeAndDate from "../../components/TimeAndDate";
import { auth } from "../../config/firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { CommentType } from "../../components/types/CommentType";
import { PostType } from "../../components/types/PostType";
import Like from "../../components/Like";
import comment_icon from "./img/comment.svg";
import delPost from "./img/del_post.svg";
// import editPostIcon from "./img/edit_post.svg";
import EditForm from "../../components/EditForm";
import save from "./img/save.svg";
import unsave from "./img/unsave.svg";
import eclipse from "./img/eclipse.svg";
import useBookmark from "../../components/hooks/useBookmark";
import useDeleteDoc from "../../components/hooks/useDeleteDoc";
import useFetchDoc from "../../components/hooks/useFetchDoc";
import useEditDoc from "../../components/hooks/useEditDoc";
import ContextMenu from "../../components/ContextMenu";

export default function Post(props: { post: PostType }) {
  const { post } = props;

  const [showContextMenu, setShowContextMenu] = useState(false);
  const { addBookmark, delBookmark, isSaved } = useBookmark("postId", post.id);
  const { delDoc: deletePost } = useDeleteDoc("posts", post.id);
  const { data: comments, getDoc: getComments } =
    useFetchDoc<CommentType>("comments");

  // const { editDoc } = useEditDoc();
  const [user] = useAuthState(auth);
  const count = comments?.length;
  const data = { comments, post, count };

  const postDate = () => {
    return post.createdAt
      ? new Date(post.createdAt.seconds * 1000)
      : new Date();
  };

  useEffect(() => {
    getComments("postId", post.id);
  }, []);
  return (
    <>
      <div
        className="w-full border-[1px] border-cGray-100 rounded-2xl bg-[#fbfbfb]"
        key={post.id}
      >
        <div className="flex items-center gap-x-2 border-b-[1px] px-2 py-1 pb-[1px]">
          <img
            src={post.userPhoto}
            alt="profile picture thumbnail"
            referrerPolicy="no-referrer"
            className="rounded-full w-11"
          />
          <div className="flex flex-col">
            <Link to={`/profile/${post.userId}`}>
              <p className="font-bold text-gray-800">{post.username}</p>
            </Link>
            <p className="text-gray-600">
              <TimeAndDate docDate={postDate()} />
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center bg-white p-2">
          <div>
            <Link to={`/post/${post.id}`} state={{ data }}>
              <p className="text-gray-800">{post.content}</p>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between border-t-[1px] border-cGray-100 px-2 py-1">
          <div>
            <Like docId={post.id} />
          </div>
          <div className="flex gap-x-2">
            <img src={comment_icon} alt="comment icon" className="w-5" />
            <Link to={`/post/${post.id}`} state={{ data }}>
              <p className="text-gray-600">{count || 0} </p>
            </Link>{" "}
          </div>
          <div className="flex items-center">
            <button onClick={isSaved ? delBookmark : addBookmark}>
              {!isSaved ? (
                <img src={save} alt="save post" />
              ) : (
                <img src={unsave} alt="unsave post" />
              )}
            </button>
          </div>

          {user?.uid == post.userId ? (
            <div>
              <button onClick={() => setShowContextMenu(!showContextMenu)}>
                <img src={eclipse} alt="context menu" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="absolute top-[175px] right-[410px]">
          {showContextMenu && (
            <ContextMenu
              setShowContextMenu={setShowContextMenu}
              showContextMenu={showContextMenu}
              targetDocCol="posts"
              targetDoc={post}
            />
          )}
        </div>
      </div>
    </>
  );
}
