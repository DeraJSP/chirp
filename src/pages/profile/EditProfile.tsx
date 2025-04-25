import { useEffect, useState } from "react";
import close from "../../components/img/close.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { UserType } from "../../components/types/UserType";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function EditForm(props: {
  showProfileEdit: boolean;
  setShowProfileEdit: (value: boolean) => void;
  userData: UserType;
}) {
  const { userData, showProfileEdit, setShowProfileEdit } = props;

  const [bio, setBio] = useState(userData.bio);
  const [location, setLocation] = useState(userData.location);
  const [birthday, setBirthday] = useState(userData.birthday);
  const [user] = useAuthState(auth);

  const schema = yup.object().shape({
    location: yup.string().required("You must add a location"),
    birthday: yup.string().required("You must add a date of birth"),
    bio: yup.string().required("You must add a bio"),
  });

  const onSubmit = async () => {
    try {
      const docSnap = doc(db, `users/${user?.uid}`);
      await updateDoc(docSnap, {
        bio: bio,
        location: location,
        birthday: birthday,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<{ bio: string; location: string; birthday: string }>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setShowProfileEdit(!isSubmitSuccessful);
  }, [isSubmitSuccessful]);

  return (
    <>
      {showProfileEdit ? (
        <div className="fixed top-0 left-0 w-full h-screen my-12 bg-black bg-opacity-50 bg-black flex items-center justify-center">
          <div className="relative p-8 bg-white shadow-xl w-2/5 h-96 rounded-2xl border-[1px] border-cGray-100">
            <button
              type="button"
              onClick={() => setShowProfileEdit(!showProfileEdit)}
              className="absolute top-3 right-3 hover:bg-cGray-100 rounded-full p-1"
            >
              <img src={close} alt="close popup" className="w-9" />
            </button>
            <div className="m-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  placeholder="Please select a date of birth"
                  {...register("birthday")}
                  defaultValue={userData.birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full text-lg p-2 mb-2 border-[1px] border-cGray-100 rounded-2xl overflow-y-auto resize-none focus:border-cBlue-200 focus:outline-none focus:ring-0"
                />{" "}
                <p className="text-red-500">{errors.bio?.message}</p>
                <input
                  placeholder="What is your location?"
                  {...register("location")}
                  defaultValue={userData.location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-lg p-2 mb-2 border-[1px] border-cGray-100 rounded-2xl overflow-y-auto resize-none focus:border-cBlue-200 focus:outline-none focus:ring-0"
                />{" "}
                <p className="text-red-500">{errors.bio?.message}</p>
                <textarea
                  placeholder="Tell us about yourself"
                  {...register("bio")}
                  defaultValue={userData.bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full h-32 text-lg p-2 border-[1px] border-cGray-100 rounded-2xl overflow-y-scroll resize-none focus:border-cBlue-200 focus:outline-none focus:ring-0"
                />
                <p className="text-red-500">{errors.bio?.message}</p>
                <button
                  type="submit"
                  className="hover:bg-cBlue-100 border border-cBlue-200 px-8 py-1 rounded-xl font-bold text-lg text-gray-900"
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
