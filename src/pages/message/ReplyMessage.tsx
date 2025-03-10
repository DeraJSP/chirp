import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  // setDoc,
  updateDoc,
} from "firebase/firestore";
import * as yup from "yup";
// import close from "../../components/img/close.svg";
// import { ProfileType } from "../../components/ProfileType";
import { ConversationType } from "../../components/ConversationType";
// import CurrentConvo from "./CurrentConvo";

export default function ReplyMessage(props: ConversationType) {
  const { ...currentConvo } = props;

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

  // const participantsId = [user?.uid, profileData.id];
  // participantsId.sort().join("");

  // const createConvoDoc = async () => {
  //   const conversationRef = collection(db, `conversations`);
  //   await setDoc(doc(conversationRef, currentConvo.id), {
  //     senderUsername: user?.displayName,
  //     senderId: user?.uid,
  //     senderUserPhoto: user?.photoURL,
  //     recipientId: profileData.id,
  //     recipientUsername: profileData.username,
  //     recipientUserPhoto: profileData.userPhoto,
  //     lastMessage: "",
  //     createdAt: timestamp,
  //   });
  // };

  const onCreateMessage = async (data: { content: string }) => {
    // createConvoDoc();

    const conversationRef = collection(
      db,
      `conversations/${currentConvo?.id}/messages`
    );

    await addDoc(conversationRef, {
      ...data,
      senderUsername: user?.displayName,
      senderId: user?.uid,
      senderUserPhoto: user?.photoURL,
      recipientId: currentConvo?.recipientId,
      recipientUsername: currentConvo?.recipientUserPhoto,
      recipientUserPhoto: currentConvo?.recipientUserPhoto,
      sent: timestamp,
      read: false,
    });

    const convoDoc = doc(db, "conversations", currentConvo?.id);

    await updateDoc(convoDoc, {
      lastMessage: {
        content: data.content,
        sent: timestamp,
      },
    });
  };
  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onCreateMessage)}>
          <textarea
            placeholder="Send a message"
            {...register("content")}
            className="w-full h-20 text-lg p-3 border-[1px] border-cGray-100 rounded-2xl overflow-y-auto resize-none"
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
    </>
  );
}
