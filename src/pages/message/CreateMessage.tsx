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
  updateDoc,
} from "firebase/firestore";
import * as yup from "yup";
import close from "../../components/img/close.svg";
import { ProfileType } from "../../components/ProfileType";

export default function CreateMessage(props: {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  profileData: ProfileType;
}) {
  const { profileData, setIsVisible, isVisible } = props;
  const [user] = useAuthState(auth);

  const timestamp = serverTimestamp();

  const schema = yup.object().shape({
    content: yup.string().required("You must add a message content"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ content: string }>({
    resolver: yupResolver(schema),
  });

  const participantsId = [user?.uid, profileData.id];
  participantsId.sort().join("");

  const createConvoDoc = async () => {
    const conversationRef = collection(db, `conversations`);
    await setDoc(doc(conversationRef, `${participantsId}`), {
      senderUsername: user?.displayName,
      senderId: user?.uid,
      senderUserPhoto: user?.photoURL,
      recipientId: profileData.id,
      recipientUsername: profileData.username,
      recipientUserPhoto: profileData.userPhoto,
      lastMessage: "",
      createdAt: timestamp,
    });
  };

  const onCreateMessage = async (data: { content: string }) => {
    createConvoDoc();

    const conversationRef = collection(
      db,
      `conversations/${participantsId}/messages`
    );

    await addDoc(conversationRef, {
      ...data,
      senderUsername: user?.displayName,
      senderId: user?.uid,
      senderUserPhoto: user?.photoURL,
      recipientId: profileData.id,
      recipientUsername: profileData.username,
      recipientUserPhoto: profileData.userPhoto,
      sent: timestamp,
      read: false,
      likes: [],
    });

    const convoDoc = doc(db, "conversations", `${participantsId}`);

    await updateDoc(convoDoc, {
      lastMessage: {
        content: data.content,
        sent: timestamp,
      },
    });
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
                  {...register("content")}
                  className="w-full h-40 text-lg p-3 border-[1px] border-cGray-100 rounded-2xl"
                />
                <p className="text-red-500">{errors.content?.message}</p>
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
