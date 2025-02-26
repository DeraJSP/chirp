import { db } from "../../config/firebase";
import { collectionGroup, getDocs, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import TimeAndDate from "../../components/TimeAndDate";

export interface Comment {
  postId: string;
  username: string;
  description: string;
  userPhoto: string;
  date: Timestamp;
  id: string;
}

export default function Comments(props: { postId: string }) {
  const [commentList, setCommentList] = useState<Comment[] | null>(null);

  // const getComments = async () => {
  //   const userColRef = collectionGroup(db, "posts");
  //   const data = await getDocs(userColRef);
  //   const userIdArr = data.docs.map((doc) => ({ id: doc.id }));

  //   const commentColRef = userIdArr?.map((user) => {
  //     return collection(db, `users/${user.id}/comments`);
  //   });

  //   const commentColArr = [];
  //   commentColArr.push(...commentColRef);

  //   const getPostDocs = await Promise.all(
  //     commentColArr?.map(async (col) => {
  //       const data = await getDocs(col);
  //       return data.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       })) as Comment[];
  //     })
  //   );

  //   const postDocs = [];
  //   postDocs.push(...getPostDocs.flat());
  //   setCommentList(postDocs);
  // };

  const getComment = async () => {
    const postsRef = collectionGroup(db, "comments");
    const data = await getDocs(postsRef);

    const postDoc = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
    setCommentList(postDoc);
  };

  const postComments = commentList?.filter(
    (comment) => comment.postId == props.postId
  ) as Comment[];

  useEffect(() => {
    getComment();
  }, []);

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-gray-700">Comments</h2>
      {postComments?.map((comment) => (
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
            <p className="text-lg text-gray-700">{comment?.description}</p>
          </div>
        </div>
      ))}
    </>
  );
}
