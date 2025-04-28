import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import * as yup from "yup";
import { useEffect } from "react";

export default function CreateComment(props: { postId: string }) {
  const { postId } = props;

  const [user] = useAuthState(auth);

  const schema = yup.object().shape({
    content: yup.string().required("The comment field is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<{ content: string }>({
    resolver: yupResolver(schema),
  });

  const commentsRef = collection(db, `comments`);

  const onCreateComment = async (data: { content: string }) => {
    await addDoc(commentsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
      userPhoto: user?.photoURL,
      postId: postId,
      createdAt: serverTimestamp(),
    });
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);
  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onCreateComment)}>
          <textarea
            placeholder="Post a comment"
            defaultValue=""
            {...register("content")}
            className="w-full h-20 p-3 border-[1px] border-cGray-100 rounded-2xl overflow-y-auto resize-none focus:border-cBlue-200 focus:outline-none focus:ring-0"
          />
          <p className="text-red-500">{errors.content?.message}</p>
          <button
            type="submit"
            className="hover:bg-cBlue-100 border border-cBlue-200 px-3 py-1 rounded-xl font-bold text-lg text-gray-900"
          >
            Comment
          </button>
        </form>
      </div>
    </>
  );
}
