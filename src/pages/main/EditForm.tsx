import { useState } from "react";
import close from "../../components/img/close.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

export default function EditForm(props: {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  post: string;
  editPost: (value: string) => void;
}) {
  const [postUpdate, setPostUpdate] = useState(props.post);
  const schema = yup.object().shape({
    description: yup.string().required("You must add a description"),
  });
  const onSubmit = () => {
    props.editPost(postUpdate);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ description: string }>({
    resolver: yupResolver(schema),
  });
  return (
    <>
      {props.isVisible ? (
        <div className="fixed top-0 left-0 w-full h-screen my-12 bg-black bg-opacity-50bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative p-8 bg-white shadow-xl w-2/5 h-96 rounded-2xl border-[1px] border-cGray-100">
            <button
              type="button"
              onClick={() => props.setIsVisible(!props.isVisible)}
              className="absolute top-3 right-3 "
            >
              <img src={close} alt="Close popup" className="w-9" />
            </button>
            <div className="m-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                  placeholder="Edit your post"
                  {...register("description")}
                  defaultValue={props.post}
                  onChange={(e) => setPostUpdate(e.target.value)}
                  className="w-full h-64 text-lg p-3 border-[1px] border-cGray-100 rounded-2xl"
                />
                <p className="text-red-500">{errors.description?.message}</p>
                <button
                  type="submit"
                  className="bg-cBlue-100 border border-cBlue-200 px-8 py-1 rounded-xl font-bold text-lg text-gray-900"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
