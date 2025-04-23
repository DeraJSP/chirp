import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import * as yup from "yup";

export default function CreateComment(props: { postId: string }) {
  const { postId } = props;

  const [user] = useAuthState(auth);

  const schema = yup.object().shape({
    content: yup.string().required("The comment field is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
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
  return (
    <>
      <div className="flex justify-center my-12">
        <div className="w-2/5">
          <form onSubmit={handleSubmit(onCreateComment)}>
            <textarea
              placeholder="Post a comment"
              {...register("content")}
              className="w-full h-40 text-lg p-3 border-[1px] border-cGray-100 rounded-2xl overflow-y-auto resize-none focus:border-cBlue-200 focus:outline-none focus:ring-0"
            />
            <p className="text-red-500">{errors.content?.message}</p>
            <button
              type="submit"
              className="bg-cBlue-100 border border-cBlue-200 px-8 py-1 rounded-xl font-bold text-lg text-gray-900 "
            >
              Comment
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
