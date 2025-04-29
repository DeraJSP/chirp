import TimeAndDate from "../../components/TimeAndDate";
import { auth } from "../../config/firebase";
import { useState } from "react";
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
import useEditDoc from "../../components/hooks/useEditDoc";

export default function Comment(props: { comment: CommentType }) {
  const { comment } = props;
  const { delDoc } = useDeleteDoc("comments", comment.id);
  const { addBookmark, delBookmark, isSaved } = useBookmark(
    "commentId",
    comment.id
  );
  const { editDoc } = useEditDoc();
  const [user] = useAuthState(auth);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <div className="bg-white w-full border-[1px] border border-cGray-100 rounded-2xl p-3 mb-5">
        <div className="flex items-center justify-start gap-x-2 mb-2">
          <img
            src={comment.userPhoto}
            alt="profile picture thumbnail"
            className="rounded-full w-11"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col justify-center">
            <p className=" font-bold text-gray-700">{comment.username}</p>

            <p className="text-gray-600">
              <TimeAndDate
                docDate={
                  comment.createdAt
                    ? new Date(comment.createdAt.seconds * 1000)
                    : new Date()
                }
              />
            </p>
          </div>
        </div>
        <div className="rounded-xl p-3">
          <p className=" text-gray-700">{comment.content}</p>
        </div>

        <div className="flex items-center justify-between gap-x-6 mx-12">
          <div>
            <Like docId={comment.id} />
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

          {user?.uid == comment.userId ? (
            <div>
              <button onClick={() => setIsVisible(!isVisible)}>
                <img src={editPostIcon} alt="edit post icon" />
              </button>
            </div>
          ) : null}

          {user?.uid == comment.userId ? (
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
              doc={comment}
              editDoc={editDoc}
              docCol="comments"
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
