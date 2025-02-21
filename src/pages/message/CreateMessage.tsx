import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import * as yup from "yup";
import close from "../../components/img/close.svg";

export default function CreateMessage(props: {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  profileUid: string;
}) {
  const { profileUid, setIsVisible, isVisible } = props;
  const [user] = useAuthState(auth);

  const timestamp = serverTimestamp();

  const schema = yup.object().shape({
    description: yup.string().required("You must add a description"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ description: string }>({
    resolver: yupResolver(schema),
  });

  const senderConvo = collection(db, `users/${user?.uid}/conversations`);
  const receieverConvo = collection(db, `users/${profileUid}/conversations`);
  const convoArr = [senderConvo, receieverConvo];

  const createConvoDoc = async () =>
    await Promise.all(
      convoArr?.map(async (convo) => {
        await setDoc(doc(convo, `${user?.uid}-${profileUid}`), {
          senderId: user?.uid,
          receiverId: profileUid,
          createdAt: timestamp,
        });
      })
    );

  const senderRef = collection(
    db,
    `users/${user?.uid}/conversations/${user?.uid}-${profileUid}/messages`
  );
  const receieverRef = collection(
    db,
    `users/${profileUid}/conversations/${user?.uid}-${profileUid}/messages`
  );
  const refArr = [senderRef, receieverRef];

  const onCreateMessage = async (data: { description: string }) => {
    createConvoDoc();
    await Promise.all(
      refArr?.map(async (ref) => {
        await addDoc(ref, {
          ...data,
          senderUsername: user?.displayName,
          senderId: user?.uid,
          senderUserPhoto: user?.photoURL,
          receiverId: profileUid,
          createdAt: timestamp,
          read: false,
        });
      })
    );
  };
  return (
    <>
      {isVisible ? (
        <div className="flex items-center justify-center w-full h-screen my-12 fixed top-0 left-0 bg-black bg-opacity-50">
          <div className="relative p-8 bg-white shadow-xl w-2/5 h-96 rounded-2xl border-[1px] border-cGray-100">
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute top-3 right-3 "
            >
              <img src={close} alt="close popup" className="w-9" />
            </button>
            <div className="m-6">
              <form onSubmit={handleSubmit(onCreateMessage)}>
                <textarea
                  placeholder="Send a message"
                  {...register("description")}
                  className="w-full h-40 text-lg p-3 border-[1px] border-cGray-100 rounded-2xl"
                />
                <p className="text-red-500">{errors.description?.message}</p>
                <button
                  type="submit"
                  className="hover:bg-cBlue-100 border border-cBlue-200 px-8 py-1 rounded-xl font-bold text-lg text-gray-900"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
