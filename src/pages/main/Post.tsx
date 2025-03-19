import {
  addDoc,
  collection,
  collectionGroup,
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

interface Like {
  likeId: string;
  userId: string;
  username: string;
}

export default function Post(props: PostType) {
  const { ...post } = props;
  const { addBookmark, delBookmark, isSaved } = useBookmark("postId", post.id);

  const [user] = useAuthState(auth);

  const postDate = new Date(post.date.seconds * 1000);

  const [commentList, setCommentList] = useState<CommentType[] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const editPost = async (postUpdate: string) => {
    const postDoc = doc(db, `users/${user?.uid}/posts`, post.id);

    await updateDoc(postDoc, {
      description: postUpdate,
    });
  };

  const deletePost = async () => {
    await deleteDoc(doc(db, `users/${user?.uid}/posts`, post.id));
  };

  const getComment = async () => {
    const postsRef = collectionGroup(db, "comments");
    const data = await getDocs(postsRef);

    const postDoc = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommentType[];
    setCommentList(postDoc);
  };

  const savePost = async () => {
    try {
      const bookmarksRef = collection(db, `bookmarks`);
      await addDoc(bookmarksRef, {
        postId: post.id,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const checkSave = async () => {
    try {
      const postStatus = query(
        collection(db, `bookmarks`),
        where("postId", "==", post.id)
      );
      const querySnapshot = await getDocs(postStatus);
      return querySnapshot.empty ? false : true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const deleteSave = async () => {
    const querySnapshot = query(
      collection(db, `bookmarks`),
      where("postId", "==", post.id)
    );
    const data = await getDocs(querySnapshot);
    await deleteDoc(doc(db, `bookmarks`, data.docs[0].id));
  };

  const postComments = commentList?.filter(
    (comment) => comment.postId == post.id
  ) as CommentType[];

  const count = postComments?.length;

  const countCheck = () => `${count > 1 ? count : count}`;

  // run the getLikes function
  useEffect(() => {
    getComment();
  }, []);

  useEffect(() => {
    const check = async () => {
      const result = await checkSave();
      setIsSaved(result);
    };

    check();
  }, [user, post]);

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
            <button onClick={isSaved ? deleteSave : savePost}>
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
              post={post.content}
              editPost={editPost}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
