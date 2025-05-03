import { useEffect, useState } from "react";
import close from "./img/close.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { PostType } from "./types/PostType";

export default function EditForm(props: {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  doc: PostType;
  editDoc: (col: string, docId: string, value: string) => void;
  docCol: string;
}) {
  const { editDoc, isVisible, setIsVisible, doc, docCol } = props;
  const [newValue, setNewValue] = useState(doc.content);
  const schema = yup.object().shape({
    content: yup.string().required("You must add a content"),
  });
  const onSubmit = () => {
    editDoc(docCol, doc.id, newValue);
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<{ content: string }>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setIsVisible(!isSubmitSuccessful);
  }, [isSubmitSuccessful]);

  return (
    <>
      {isVisible ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 bg-black flex items-center justify-center">
          <div className="relative p-8 bg-white shadow-xl w-2/5 h-64 rounded-2xl border-[1px] border-cGray-100">
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute top-3 right-3 hover:bg-cGray-100 rounded-full p-1"
            >
              <img src={close} alt="Close popup" className="w-9" />
            </button>
            <div className="m-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                  placeholder="Edit your post"
                  {...register("content")}
                  defaultValue={doc.content}
                  onChange={(e) => setNewValue(e.target.value)}
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
