import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import TimeAndDate from "../../components/TimeAndDate";
import { auth, db } from "../../config/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Like from "../../components/Like";
import delPost from "../main/img/del_post.svg";
import editPostIcon from "../main/img/edit_post.svg";
import EditForm from "../../components/EditForm";
import save from "../main/img/save.svg";
import unsave from "../main/img/unsave.svg";
import { CommentType } from "../../components/types/CommentType";
import useDeleteDoc from "../../components/hooks/useDeleteDoc";
import useBookmark from "../../components/hooks/useBookmark";

interface Like {
  likeId: string;
  userId: string;
  username: string;
}

export default function Comment(props: CommentType) {
  const { ...comment } = props;
  const { delDoc } = useDeleteDoc("comments", comment.id);
  const { addBookmark, delBookmark, isSaved } = useBookmark(
    "bookmarks",
    "commentId",
    comment.id
  );
  const [user] = useAuthState(auth);

  const [isVisible, setIsVisible] = useState(false);

  const editPost = async (commentUpdate: string) => {
    const commentDoc = doc(db, `comments`, comment.id);
    await updateDoc(commentDoc, {
      description: commentUpdate,
    });
  };

  return (
    <>
      <div className="bg-white w-full border-[1px] border border-cGray-100 rounded-2xl p-3 mb-5">
        <div className="flex items-center justify-start gap-x-2 mb-2">
          <img
            src={comment?.userPhoto}
            alt="profile picture thumbnail"
            className="rounded-full w-11"
          />
          <div className="flex flex-col justify-center">
            <p className="text-lg font-bold text-gray-700">
              {comment?.username}
            </p>
            <p className="text-gray-600">
              <TimeAndDate postDate={comment.date.toDate()} />
            </p>
          </div>
        </div>
        <div className="rounded-xl p-3">
          <p className="text-lg text-gray-700">{comment?.content}</p>
        </div>

        <div className="flex items-center justify-between gap-x-6 mx-12">
          <div>
            <Like postId={comment?.id} />
          </div>

          <div>
            <button onClick={isSaved ? delBookmark : addBookmark}>
              {isSaved ? (
                <img src={unsave} alt="unsave post" />
              ) : (
                <img src={save} alt="save post" />
              )}
            </button>
          </div>

          {user?.uid == comment?.userId ? (
            <div>
              <button onClick={() => setIsVisible(!isVisible)}>
                <img src={editPostIcon} alt="edit post icon" />
              </button>
            </div>
          ) : null}

          {user?.uid == comment?.userId ? (
            <div>
              {" "}
              <button onClick={delDoc}>
                <img src={delPost} alt="delete post icon" />
              </button>{" "}
            </div>
          ) : null}
        </div>
        <div>
          {isVisible ? (
            <EditForm
              setIsVisible={setIsVisible}
              isVisible={isVisible}
              post={comment.content}
              editPost={editPost}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
