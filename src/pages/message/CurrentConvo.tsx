import { useLocation } from "react-router-dom";
import PreviousPage from "../../components/PreviousPage";
import { useEffect, useState } from "react";
import { MessageType } from "../../components/MessageType";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TimeAndDate from "../../components/TimeAndDate";
import ReplyMessage from "./replyMessage";
import { ConversationType } from "../../components/ConversationType";
// import CreateMessage from "./CreateMessage";

export default function CurrentConvo() {
  const [convoMessages, setConvoMessages] = useState<MessageType[] | null>(
    null
  );
  const [currentConvo, setCurrentConvo] = useState<ConversationType | null>(
    null
  );
  // const [isVisible, setIsVisible] = useState(true);

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
      setCurrentConvo(location.state.currentConvo);

      const messagesRef = collection(
        db,
        `conversations/${currentConvo?.id}/messages`
      );
      const querySnapshot = query(messagesRef, orderBy("sent"));
      const data = await getDocs(querySnapshot);

      const messagesDoc = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MessageType[];
      setConvoMessages(messagesDoc);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    await deleteDoc(
      doc(db, `conversations/${currentConvo?.id}/messages`, messageId)
    );
  };

  useEffect(() => {
    getMessages();
  }, [currentConvo]);
  return (
    <>
      <div className="flex fixed top-[57px] w-full bg-white border-[1px] border-cGray-100 p-2">
        {" "}
        <PreviousPage page={""} />
        <div className="flex items-center gap-x-3 font-bold text-lg text-gray-600">
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
        <div className="flex flex-col gap-5 w-2/5">
          {convoMessages?.map((message) => {
            return user?.uid === message.senderId ? (
              <div className="flex">
                <div className="bg-cBlue-100 border border-cBlue-200 py-2 px-3 rounded-3xl text-gray-800">
                  <div>
                    <p>{message.content}</p>
                    <p className="text-gray-500 text-sm italic mt-2">
                      <TimeAndDate
                        postDate={new Date(message.sent.seconds * 1000)}
                      />
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="bg-white border-[1px] border-cGray-100 py-2 px-3 rounded-3xl text-gray-800">
                  <div>
                    <p>{message.content}</p>
                    <p className="text-gray-500 text-sm italic mt-2">
                      <TimeAndDate
                        postDate={new Date(message.sent.seconds * 1000)}
                      />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center items-center m-5 w-full h-full">
        <div className="fixed bottom-0 w-1/2 pb-5 bg-[#f3f4f6]">
          {currentConvo ? <ReplyMessage {...currentConvo} /> : null}
        </div>
      </div>

      {/* <CreateMessage
        setIsVisible={setIsVisible}
        isVisible={isVisible}
        profileData={profileData as ProfileType}
      /> */}
    </>
  );
}
