import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import * as yup from "yup";

interface createCommentData {
  description: string;
}

export default function CreateComment(props: { postId: string }) {
  const navigate = useNavigate();

  const [user] = useAuthState(auth);

  const timestamp = serverTimestamp();

  const schema = yup.object().shape({
    description: yup.string().required("You must add a description"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createCommentData>({
    resolver: yupResolver(schema),
  });

  const commentsRef = collection(db, `users/${user?.uid}/comments`);

  const onCreateComment = async (data: createCommentData) => {
    await addDoc(commentsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
      userPhoto: user?.photoURL,
      postId: props.postId,
      date: timestamp,
    });

    navigate(`/`);
  };
  return (
    <>
      <div className="flex justify-center my-12">
        <div className="w-2/5">
          <form onSubmit={handleSubmit(onCreateComment)}>
            <textarea
              placeholder="Post a comment"
              {...register("description")}
              className="w-full h-40 text-lg p-3 border-[1px] border-cGray-100 rounded-2xl"
            />
            <p className="text-red-500">{errors.description?.message}</p>
            <button
              type="submit"
              className="bg-cBlue-100 border border-cBlue-200 px-8 py-1 rounded-xl font-bold text-lg text-gray-900"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
