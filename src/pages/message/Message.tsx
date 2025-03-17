import { useEffect, useState } from "react";
import { collection, getDocs, or, query, where } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import PreviousPage from "../../components/PreviousPage";
import Conversation from "./Conversation";
import { ConversationType } from "../../components/types/ConversationType";

export default function Message() {
  const [conversation, setConversation] = useState<ConversationType[] | null>(
    null
  );

  const [user] = useAuthState(auth);

  const getConversation = async () => {
    try {
      const conversationsRef = collection(db, "conversations");
      const querySnapshot = query(
        conversationsRef,
        or(
          where("senderId", "==", user?.uid || ""),
          where("recipientId", "==", user?.uid || "")
        )
      );
      const data = await getDocs(querySnapshot);

      const conversationDoc = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ConversationType[];
      setConversation(conversationDoc);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConversation();
  }, [user?.uid]);

  return (
    <>
      <PreviousPage page="Conversations" />

      <section className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-5 w-1/3 my-10">
          {conversation?.map((convo) => (
            <Conversation
              key={convo.id}
              {...convo}
              role={convo.senderId === user?.uid ? "recipient" : "sender"}
            />
          ))}
        </div>
      </section>
    </>
  );
}
