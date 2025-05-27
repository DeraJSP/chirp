import { useEffect, useState } from "react";
import close from "./img/close.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { PostType } from "./types/PostType";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function EditForm(props: {
  showEditForm: boolean;
  setShowEditForm: (value: boolean) => void;
  targetDoc: PostType;
  targetDocCol: string;
}) {
  const { showEditForm, setShowEditForm, targetDoc, targetDocCol } = props;
  const [formData, setFormData] = useState(targetDoc.content);

  const editDoc = async () => {
    try {
      const querySnapshot = doc(db, targetDocCol, targetDoc.id);
      await updateDoc(querySnapshot, {
        content: formData,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const schema = yup.object().shape({
    content: yup.string().required("You must add a content"),
  });
  const onSubmit = () => {
    editDoc();
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<{ content: string }>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setShowEditForm(!isSubmitSuccessful);
  }, [isSubmitSuccessful]);

  return (
    <>
      {showEditForm ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 bg-black flex items-center justify-center">
          <div className="relative p-8 bg-white shadow-xl w-2/5 h-64 rounded-2xl border-[1px] border-cGray-100">
            <button
              type="button"
              onClick={() => setShowEditForm(!showEditForm)}
              className="absolute top-3 right-3 hover:bg-cGray-100 rounded-full p-1"
            >
              <img src={close} alt="Close popup" className="w-9" />
            </button>
            <div className="m-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                  placeholder="Edit your post"
                  {...register("content")}
                  defaultValue={targetDoc.content}
                  onChange={(e) => setFormData(e.target.value)}
                  className="w-full h-36 bg-[#fbfbfb] p-3 border-[1px] border-cGray-100 rounded-2xl overflow-y-auto resize-none focus:border-cBlue-200 focus:outline-none focus:ring-0"
                />
                <p className="text-red-500">{errors.content?.message}</p>
                <button
                  type="submit"
                  className="hover:bg-cBlue-100 bg-[#fbfbfb] border border-cBlue-200 px-3 py-1 rounded-xl font-bold text-gray-900"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
