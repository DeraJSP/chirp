import { useLocation } from "react-router-dom";
import PreviousPage from "../../components/PreviousPage";
import { useEffect, useState } from "react";
import { MessageType } from "../../components/types/MessageType";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ReplyMessage from "./ReplyMessage";
import { ConversationType } from "../../components/types/ConversationType";
import MessageList from "./MessageList";

export default function CurrentConvo() {
  const [convoMessages, setConvoMessages] = useState<MessageType[] | null>(
    null
  );
  const [currentConvo, setCurrentConvo] = useState<ConversationType | null>(
    null
  );

  const [user] = useAuthState(auth);
  const participantPhoto =
    user?.uid !== currentConvo?.senderId
      ? currentConvo?.senderUserPhoto
      : currentConvo?.recipientUserPhoto;
  const participantUsername =
    user?.uid !== currentConvo?.senderId
      ? currentConvo?.senderUsername
      : currentConvo?.recipientUsername;

  const location = useLocation();

  const getMessages = async () => {
    try {
      setCurrentConvo(location?.state?.currentConvo);

      const messagesRef = collection(
        db,
        `conversations/${currentConvo?.id}/messages`
      );
      const querySnapshot = query(messagesRef, orderBy("sent"));

      const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
        const messagesDoc = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MessageType[];
        setConvoMessages(messagesDoc);
      });
      return () => {
        unsubscribe();
        console.log("clean up ran");
      };
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();
  }, [currentConvo]);

  return (
    <>
      <div className="flex fixed top-[57px] w-full bg-white border-[1px] border-cGray-100 p-2">
        {" "}
        <PreviousPage page={""} />
        <div className="flex items-center gap-x-3 font-bold text-gray-600">
          <img
            src={participantPhoto}
            alt="sender photo"
            className="rounded-full w-11"
            referrerPolicy="no-referrer"
          />
          <p>{participantUsername}</p>
        </div>
      </div>
      <div className="flex justify-center mt-20 mb-36">
        <div className="flex flex-col gap-2 w-2/5">
          {convoMessages?.map((message) => (
            <MessageList
              key={message.id}
              message={message}
              convoId={currentConvo?.id || ""}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center m-5 w-full h-full">
        <div className="fixed bottom-0 w-1/2 pb-5 bg-[#f3f4f6]">
          {currentConvo ? <ReplyMessage {...currentConvo} /> : null}
        </div>
      </div>
    </>
  );
}
