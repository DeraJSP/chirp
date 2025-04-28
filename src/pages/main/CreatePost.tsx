import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import close from "../../components/img/close.svg";

export const CreatePost = (props: {
  showPostForm: boolean;
  setShowPostForm: (value: boolean) => void;
}) => {
  const { showPostForm, setShowPostForm } = props;
  const [user] = useAuthState(auth);

  //validates the data and defines how it should look

  const schema = yup.object().shape({
    content: yup.string().required("You must add a content"),
  });

  // yupResolver acts as a bridge between yup validation lib and react hook form

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<{ content: string }>({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, `posts`);

  const onCreatePost = async (data: { content: string }) => {
    await addDoc(postsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
      userPhoto: user?.photoURL,
      createdAt: serverTimestamp(),
    });
  };

  useEffect(() => {
    setShowPostForm(!isSubmitSuccessful);
  }, [isSubmitSuccessful]);

  return (
    <>
      {showPostForm ? (
        <div className="fixed top-0 left-0 w-full h-screen my-12 bg-black bg-opacity-50 bg-black flex items-center justify-center">
          <div className="relative p-8 bg-white shadow-xl w-2/5 h-68 rounded-2xl border-[1px] border-cGray-100">
            <button
              type="button"
              onClick={() => setShowPostForm(!showPostForm)}
              className="absolute top-3 right-3 hover:bg-cGray-100 rounded-full p-1"
            >
              <img src={close} alt="close popup" className="w-9" />
            </button>
            <div className="m-6">
              <form onSubmit={handleSubmit(onCreatePost)}>
                <textarea
                  placeholder="Make a post"
                  {...register("content")}
                  className="w-full h-32 p-3 border-[1px] border-cGray-100 rounded-2xl overflow-y-auto resize-none focus:border-cBlue-200 focus:outline-none focus:ring-0"
                />
                <p className="text-red-500">{errors.content?.message}</p>
                <button
                  type="submit"
                  className="hover:bg-cBlue-100 border border-cBlue-200 px-4 py-1 rounded-xl font-bold text-gray-900"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
