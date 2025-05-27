import TimeAndDate from "../../components/TimeAndDate";
import { auth, db } from "../../config/firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { PostType } from "../../components/types/PostType";
import Like from "../../components/Like";
import comment_icon from "../main/img/comment.svg";
import delPost from "../main/img/del_post.svg";
import editPostIcon from "../main/img/edit_post.svg";
import line from "../main/img/line.svg";
import EditForm from "../../components/EditForm";
import save from "../main/img/save.svg";
import unsave from "../main/img/unsave.svg";
import useBookmark from "../../components/hooks/useBookmark";
import useDeleteDoc from "../../components/hooks/useDeleteDoc";
import useEditDoc from "../../components/hooks/useEditDoc";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export default function PostDetails(props: {
  post: PostType;
  count: number;
  setShowCommentForm: (value: boolean) => void;
}) {
  const { post, count, setShowCommentForm } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [singlePost, setSinglePost] = useState<PostType | null>(null);
  const { addBookmark, delBookmark, isSaved } = useBookmark("postId", post.id);
  const { delDoc: deletePost } = useDeleteDoc("posts", post.id);
  const { editDoc } = useEditDoc();
  const [user] = useAuthState(auth);

  const postDate = () => {
    return singlePost?.createdAt
      ? new Date(singlePost?.createdAt.seconds * 1000)
      : new Date();
  };

  const getPost = async () => {
    const postRef = doc(db, `posts/${post.id}`);
    const docSnapshot = await getDoc(postRef);
    const postDoc = {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    } as PostType;
    setSinglePost(postDoc);
  };

  const getPostFromCache = () => {
    try {
      const postRef = doc(db, `posts/${post.id}`);
      const unsubscribe = onSnapshot(
        postRef,
        { source: "cache" },
        (snapshot) => {
          const postDoc = {
            id: snapshot.id,
            ...snapshot.data(),
          } as PostType;
          setSinglePost(postDoc);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPost();
    getPostFromCache();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = getCacheDoc();
  //   return () => {
  //     if (unsubscribe) {
  //       unsubscribe();
  //       console.log("clean up ran");
  //     }
  //   };
  // }, []);

  useEffect(() => {
    setShowCommentForm(!isVisible);
  }, [isVisible]);

  return (
    <>
      {singlePost && (
        <div
          className="w-full border-[1px] border-cGray-100 rounded-2xl bg-[#fbfbfb]"
          key={singlePost.id}
        >
          <div className="flex items-center gap-x-2 border-b-[1px] px-2 py-1 pb-[1px]">
            <img
              src={singlePost.userPhoto}
              alt="profile picture thumbnail"
              referrerPolicy="no-referrer"
              className="rounded-full w-11"
            />
            <div className="flex flex-col">
              <Link to={`/profile/${singlePost.userId}`}>
                <p className="font-bold text-gray-800">{singlePost.username}</p>
              </Link>
              <p className="text-gray-600">
                <TimeAndDate docDate={postDate()} />
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start justify-center bg-white p-2">
            <div>
              <p className="text-gray-800">{singlePost.content}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t-[1px] border-cGray-100 px-2 py-1">
            <div>
              <Like docId={singlePost.id} />
            </div>
            <div className="flex gap-x-2">
              <img src={comment_icon} alt="comment icon" className="w-5" />
              <p className="text-gray-600">{count || 0} </p>
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

            {user?.uid == singlePost.userId ? (
              <>
                <div>
                  <button onClick={() => setIsVisible(!isVisible)}>
                    <img src={editPostIcon} alt="edit post icon" />
                  </button>
                </div>
                <div>
                  <button onClick={deletePost}>
                    <img src={delPost} alt="delete post icon" />
                  </button>
                </div>
              </>
            ) : null}
          </div>

          <div>
            {isVisible ? (
              <EditForm
                setIsVisible={setIsVisible}
                isVisible={isVisible}
                doc={singlePost}
                editDoc={editDoc}
                docCol="posts"
              />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
