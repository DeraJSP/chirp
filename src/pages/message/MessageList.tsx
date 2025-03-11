import { useEffect, useState } from "react";
import { MessageType } from "../../components/MessageType";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import TimeAndDate from "../../components/TimeAndDate";
import del from "./img/del_msg.svg";
import like from "../../components/img/like.svg";
import unlike from "../../components/img/unlike.svg";

export default function MessageList(props: {
  convoId: string;
  message: MessageType;
}) {
  const { convoId, message } = props;
  const [user] = useAuthState(auth);
  const [isVisible, setIsVisible] = useState(false);
  const [messageLikes, setMessageLikes] = useState<MessageType | null>(null);

  const deleteMessage = async (messageId: string) => {
    await deleteDoc(doc(db, `conversations/${convoId}/messages`, messageId));
  };

  const likeMessage = async (messageId: string) => {
    const messageDoc = doc(db, `conversations/${convoId}/messages`, messageId);
    await updateDoc(messageDoc, {
      likes: arrayUnion(user?.uid),
    });
  };

  const unlikeMessage = async (messageId: string) => {
    const messageDoc = doc(db, `conversations/${convoId}/messages`, messageId);
    await updateDoc(messageDoc, {
      likes: arrayRemove(user?.uid),
    });
  };

  const getMessageLikes = async (messageId: string) => {
    const messageRef = doc(db, `conversations/${convoId}/messages`, messageId);
    const messageDoc = await getDoc(messageRef);

    const messageData = {
      id: messageDoc.id,
      ...messageDoc.data(),
    } as MessageType;
    setMessageLikes(messageData);
  };

  const likedMessage = messageLikes?.likes?.includes(user?.uid || "");

  useEffect(() => {
    getMessageLikes(message.id);
  }, []);

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
                <TimeAndDate
                  postDate={
                    message.sent
                      ? new Date(message?.sent.seconds * 1000)
                      : new Date()
                  }
                />
              </p>
            </div>
          </div>
          <div className="flex items-end ml-2">
            {isVisible ? (
              <div className="flex gap-x-2">
                {likedMessage ? (
                  <button onClick={() => unlikeMessage(message.id)}>
                    <div className="flex items-center gap-x-[1px]">
                      <img src={like} className="w-6 m-1" alt="like" />
                      <p className="text-gray-600">
                        {messageLikes?.likes?.length}
                      </p>
                    </div>
                  </button>
                ) : (
                  <button onClick={() => likeMessage(message.id)}>
                    <div className="flex items-center gap-x-[1px]">
                      <img src={unlike} className="w-6 m-1" alt="like" />
                      <p className="text-gray-600">
                        {messageLikes?.likes?.length}
                      </p>
                    </div>
                  </button>
                )}
                <button onClick={() => deleteMessage(message.id)}>
                  <img src={del} className="w-4 m-1" alt="delete message" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div
          className="flex justify-end"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          {" "}
          <div className="flex items-end ml-2">
            {isVisible ? (
              <div className="flex mr-2">
                {likedMessage ? (
                  <button onClick={() => unlikeMessage(message.id)}>
                    <div className="flex items-center gap-x-[1px]">
                      <img src={like} className="w-6 m-1" alt="like" />
                      <p className="text-gray-600">
                        {messageLikes?.likes?.length}
                      </p>
                    </div>
                  </button>
                ) : (
                  <button onClick={() => likeMessage(message.id)}>
                    <div className="flex items-center gap-x-[1px]">
                      <img src={unlike} className="w-6 m-1" alt="like" />
                      <p className="text-gray-600">
                        {messageLikes?.likes?.length}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            ) : null}
          </div>
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
