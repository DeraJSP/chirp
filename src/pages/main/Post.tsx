// import { doc, updateDoc } from "firebase/firestore";
import TimeAndDate from "../../components/TimeAndDate";
import { auth } from "../../config/firebase";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { CommentType } from "../../components/types/CommentType";
import { PostType } from "../../components/types/PostType";
import Like from "../../components/Like";
import comment from "./img/comment.svg";
import delPost from "./img/del_post.svg";
import editPostIcon from "./img/edit_post.svg";
import EditForm from "../../components/EditForm";
import save from "./img/save.svg";
import unsave from "./img/unsave.svg";
import useBookmark from "../../components/hooks/useBookmark";
import useDeleteDoc from "../../components/hooks/useDeleteDoc";
import useFetchDoc from "../../components/hooks/useFetchDoc";
import useEditDoc from "../../components/hooks/useEditDoc";

// interface Like {
//   likeId: string;
//   userId: string;
//   username: string;
// }

export default function Post(props: PostType) {
  const { ...post } = props;
  const [isVisible, setIsVisible] = useState(false);

  const { addBookmark, delBookmark, isSaved } = useBookmark("postId", post.id);
  const { delDoc: deletePost } = useDeleteDoc("posts", post.id);
  const { data: comments } = useFetchDoc<CommentType>(
    "comments",
    "postId",
    post.id,
    ""
  );
  const { editDoc: editPost } = useEditDoc();
  const [user] = useAuthState(auth);

  const postDate = new Date(post.date.seconds * 1000);

  // const editPost = async (postUpdate: string) => {
  //   try {
  //     const postDoc = doc(db, `posts`, post.id);

  //     await updateDoc(postDoc, {
  //       content: postUpdate,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const count = comments?.length;
  const countCheck = () => `${count || 0 > 1 ? count : count}`;

  return (
    <>
      <div
        className="w-full p-3 border-[1px] border-cGray-100 rounded-2xl bg-white"
        key={post?.id}
      >
        <div className="flex items-center gap-x-2 mb-3">
          <img
            src={post?.userPhoto}
            alt="profile picture thumbnail"
            referrerPolicy="no-referrer"
            className="rounded-full w-11"
          />
          <div className="flex flex-col">
            <Link to={`/profile/${post?.userId}`}>
              <p className="font-bold text-lg text-gray-800">
                @{post?.username}
              </p>
            </Link>
            <p className="text-gray-600">
              {" "}
              <TimeAndDate postDate={postDate} />
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <div className="mb-5">
            <Link to={`/post/${post.id}`} state={{ currentPost: post }}>
              <p className="text-lg text-gray-800">{post?.content}</p>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between mx-10">
          <div>
            <Like postId={post?.id} />
          </div>
          <div className="flex gap-x-2">
            <img src={comment} alt="comment icon" className="w-5" />
            <Link to={`/post/${post.id}`} state={{ currentPost: post }}>
              <p className="text-gray-600">{countCheck()} </p>
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

          {user?.uid == post?.userId ? (
            <div>
              <button onClick={() => setIsVisible(!isVisible)}>
                <img src={editPostIcon} alt="edit post icon" />
              </button>
            </div>
          ) : null}

          {user?.uid == post?.userId ? (
            <div>
              <button onClick={deletePost}>
                <img src={delPost} alt="delete post icon" />
              </button>
            </div>
          ) : null}
        </div>

        <div>
          {isVisible ? (
            <EditForm
              setIsVisible={setIsVisible}
              isVisible={isVisible}
              post={post}
              editPost={editPost}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
