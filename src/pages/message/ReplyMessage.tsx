import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import * as yup from "yup";
import { ConversationType } from "../../components/types/ConversationType";
import { useEffect } from "react";

export default function ReplyMessage(props: ConversationType) {
  const { ...currentConvo } = props;

  const [user] = useAuthState(auth);

  const schema = yup.object().shape({
    content: yup.string().required("You must add a message content"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<{ content: string }>({
    resolver: yupResolver(schema),
  });

  const onCreateMessage = async (data: { content: string }) => {
    try {
      const messagesRef = collection(
        db,
        `conversations/${currentConvo?.id}/messages`
      );

      await addDoc(messagesRef, {
        ...data,
        senderUsername: user?.displayName,
        senderId: user?.uid,
        senderUserPhoto: user?.photoURL,
        recipientId: currentConvo?.recipientId,
        recipientUsername: currentConvo?.recipientUserPhoto,
        recipientUserPhoto: currentConvo?.recipientUserPhoto,
        sent: serverTimestamp(),
        read: false,
        likes: [],
      });

      const convoDoc = doc(db, "conversations", currentConvo?.id);

      await updateDoc(convoDoc, {
        lastMessage: {
          content: data.content,
          sent: serverTimestamp(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);
  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onCreateMessage)}>
          <textarea
            defaultValue=""
            placeholder="Send a message"
            {...register("content")}
            className="w-full h-20 text-lg p-3 border-[1px] border-cGray-100 rounded-2xl overflow-y-auto resize-none focus:border-cBlue-200 focus:outline-none focus:ring-0 "
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
