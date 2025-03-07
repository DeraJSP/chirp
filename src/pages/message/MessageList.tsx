import { useState } from "react";
import { MessageType } from "../../components/MessageType";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import TimeAndDate from "../../components/TimeAndDate";
import del from "./img/del_msg.svg";

export default function MessageList(props: {
  convoId: string;
  message: MessageType;
}) {
  const { convoId, message } = props;
  const [user] = useAuthState(auth);
  const [isVisible, setIsVisible] = useState(false);

  const deleteMessage = async (messageId: string) => {
    await deleteDoc(doc(db, `conversations/${convoId}/messages`, messageId));
  };

  return (
    <>
      {user?.uid === message.senderId ? (
        <div
          className="flex"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className="bg-cBlue-100 border border-cBlue-200 py-2 px-3 rounded-3xl text-gray-800">
            <div>
              <p>{message.content}</p>
              <p className="text-gray-500 text-sm italic mt-2">
                <TimeAndDate postDate={new Date(message.sent.seconds * 1000)} />
              </p>
            </div>
          </div>
          <div className="flex items-end ml-2">
            {isVisible ? (
              <button onClick={() => deleteMessage(message.id)}>
                <img src={del} className="w-4 m-1" alt="delete message" />
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <div className="bg-white border-[1px] border-cGray-100 py-2 px-3 rounded-3xl text-gray-800">
            <div>
              <p>{message.content}</p>
              <p className="text-gray-500 text-sm italic mt-2">
                <TimeAndDate postDate={new Date(message.sent.seconds * 1000)} />
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
