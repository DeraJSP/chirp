import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface CreateFormData {
  description: string;
}

export const CreateForm = () => {
  const navigate = useNavigate();

  const [user] = useAuthState(auth);

  const timestamp = serverTimestamp();

  //validates the data and defines how it should look

  const schema = yup.object().shape({
    description: yup.string().required("You must add a description"),
  });

  // yupResolver acts as a bridge between yup validation lib and react hook form

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, `users/${user?.uid}/posts`);

  const onCreatePost = async (data: CreateFormData) => {
    await addDoc(postsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
      userPhoto: user?.photoURL,
      date: timestamp,
    });

    navigate("/");
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="w-2/5">
          <form onSubmit={handleSubmit(onCreatePost)}>
            <textarea
              placeholder="What's on your mind?"
              {...register("description")}
              className="w-full h-64 text-lg p-3 border-[1px] border-cGray-100 rounded-2xl"
            />
            <p className="text-red-500">{errors.description?.message}</p>
            <button
              type="submit"
              className="hover:bg-cBlue-100 border border-cBlue-200 px-8 py-1 rounded-xl font-bold text-lg text-gray-900"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
