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
// import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
// import { PostType } from "../../components/types/PostType";
import Like from "../../components/Like";
// import comment from "./img/comment.svg";
import delPost from "../main/img/del_post.svg";
import editPostIcon from "../main/img/edit_post.svg";
import EditForm from "../../components/EditForm";
import save from "../main/img/save.svg";
import unsave from "../main/img/unsave.svg";
import { CommentType } from "../../components/types/CommentType";
import useDeleteDoc from "../../components/hooks/useDeleteDoc";

interface Like {
  likeId: string;
  userId: string;
  username: string;
}

export default function Comment(props: CommentType) {
  const { ...comment } = props;

  const [user] = useAuthState(auth);

  const [isSaved, setIsSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const editPost = async (commentUpdate: string) => {
    const commentDoc = doc(db, `comments`, comment.id);

    await updateDoc(commentDoc, {
      description: commentUpdate,
    });
  };

  const addBookmark = async () => {
    try {
      const bookmarksRef = collection(db, `bookmarks`);
      await addDoc(bookmarksRef, {
        commentId: comment.id,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const checkBookmark = async () => {
    try {
      const querySnapshot = query(
        collection(db, `bookmarks`),
        where("commentId", "==", comment.id)
      );
      const data = await getDocs(querySnapshot);
      return data.empty ? setIsSaved(false) : setIsSaved(true);
    } catch (error) {
      console.error(error);
    }
  };

  const delBookmark = async () => {
    try {
      const querySnapshot = query(
        collection(db, `bookmarks`),
        where("id", "==", comment.id)
      );
      const data = await getDocs(querySnapshot);
      await deleteDoc(doc(db, `bookmarks`, data.docs[0].id));
    } catch (error) {
      console.error(error);
    }
  };

  const { delDoc } = useDeleteDoc("comments", comment.id);

  useEffect(() => {
    // const check = async () => {
    //   const result = await checkSave();
    //   setIsSaved(result);
    // };

    checkBookmark();
  }, [user, comment]);

  // useEffect(() => {
  //   const check = async () => {
  //     const result = await checkBookmark();
  //     setIsSaved(result);
  //   };

  //   check();
  // }, [user, post]);

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

        <div className="flex items-center justify-center gap-x-6">
          <div>
            <Like postId={comment?.id} />
          </div>

          {/* <div className="flex gap-x-2">
            <img src={comment} alt="comment icon" className="w-5" />
            <Link to={`/post/${post.id}`} state={{ currentPost: post }}>
              <p className="text-gray-600">{countCheck()} </p>
            </Link>{" "}
          </div> */}
          <div>
            <button onClick={isSaved ? () => delBookmark : () => addBookmark}>
              {!isSaved ? (
                <img src={save} alt="save post" />
              ) : (
                <img src={unsave} alt="unsave post" />
              )}
            </button>
          </div>
          <div>
            {user?.uid == comment?.userId ? (
              <button onClick={() => setIsVisible(!isVisible)}>
                <img src={editPostIcon} alt="edit post icon" />
              </button>
            ) : null}
          </div>
          <div>
            {user?.uid == comment?.userId ? (
              <button onClick={delDoc}>
                <img src={delPost} alt="delete post icon" />
              </button>
            ) : null}
          </div>
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

      {/* <div
        className="w-full p-3 border-[1px] border-cGray-100 rounded-2xl bg-white"
        key={post?.id}
      >
        <div className="flex items-center gap-x-2 mb-3">
          <img
            src={post?.userPhoto}
            alt="profile picture thumbnail"
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
              <p className="text-lg text-gray-800">{post?.description}</p>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-x-6">
            <div>
              <Like postId={post?.id} />
            </div>

            <div className="flex gap-x-2">
              <img src={comment} alt="comment icon" className="w-5" />
              <Link to={`/post/${post.id}`} state={{ currentPost: post }}>
                <p className="text-gray-600">{countCheck()} </p>
              </Link>{" "}
            </div>
            <div>
              <button onClick={isSaved ? deleteSave : savePost}>
                {!isSaved ? (
                  <img src={save} alt="save post" />
                ) : (
                  <img src={unsave} alt="unsave post" />
                )}
              </button>
            </div>
            <div>
              {user?.uid == post?.userId ? (
                <button onClick={() => setIsVisible(!isVisible)}>
                  <img src={editPostIcon} alt="edit post icon" />
                </button>
              ) : null}
            </div>
            <div>
              {user?.uid == post?.userId ? (
                <button onClick={deletePost}>
                  <img src={delPost} alt="delete post icon" />
                </button>
              ) : null}
            </div>
          </div>
          <div>
            {isVisible ? (
              <EditForm
                setIsVisible={setIsVisible}
                isVisible={isVisible}
                post={post.description}
                editPost={editPost}
              />
            ) : null}
          </div>
        </div>
      </div> */}
    </>
  );
}
