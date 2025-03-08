import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import TimeAndDate from "../../components/TimeAndDate";
import { auth, db } from "../../config/firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { PostType } from "../../components/PostType";
import Like from "../../components/Like";
import comment from "./img/comment.svg";
import delPost from "./img/del_post.svg";
import editPostIcon from "./img/edit_post.svg";
import EditForm from "./EditForm";
import save from "./img/save.svg";
import unsave from "./img/unsave.svg";

interface Like {
  likeId: string;
  userId: string;
  username: string;
}

export default function Post(props: PostType) {
  const { ...post } = props;

  const [user] = useAuthState(auth);

  const postDate = new Date(post.date.seconds * 1000);

  const [commentList, setCommentList] = useState<PostType[] | null>(null);
  const [isSaved, setIsSaved] = useState(false);
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
    })) as PostType[];
    setCommentList(postDoc);
  };

  const savePost = async () => {
    const bookmarksRef = collection(db, `users/${user?.uid}/bookmarks`);
    await addDoc(bookmarksRef, post);
  };

  const checkSave = async () => {
    try {
      const postStatus = query(
        collection(db, `users/${user?.uid}/bookmarks`),
        where("id", "==", post.id)
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
      collection(db, `users/${user?.uid}/bookmarks`),
      where("id", "==", post.id)
    );
    const data = await getDocs(querySnapshot);
    await deleteDoc(doc(db, `users/${user?.uid}/bookmarks`, data.docs[0].id));
  };

  const postComments = commentList?.filter(
    (comment) => comment.postId == post.id
  ) as PostType[];

  const count = postComments?.length;

  const countCheck = () =>
    `${count > 1 ? count + " Comments" : count + " Comment"}`;

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
      </div>
    </>
  );
}
