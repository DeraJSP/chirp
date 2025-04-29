import { useEffect, useState } from "react";
import { MessageType } from "../../components/types/MessageType";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  getDocFromCache,
  updateDoc,
} from "firebase/firestore";
import TimeAndDate from "../../components/TimeAndDate";
import del from "./img/del_msg.svg";
import like from "../main/img/like.svg";
import unlike from "../main/img/unlike.svg";

export default function MessageList(props: {
  convoId: string;
  message: MessageType;
}) {
  const { convoId, message } = props;
  const [user] = useAuthState(auth);
  const [isVisible, setIsVisible] = useState(false);
  const [messageLikes, setMessageLikes] = useState<MessageType | null>(null);

  const deleteMessage = async () => {
    try {
      await deleteDoc(doc(db, `conversations/${convoId}/messages`, message.id));
    } catch (error) {
      console.error(error);
    }
  };

  const likeMessage = async () => {
    try {
      const messageDoc = doc(
        db,
        `conversations/${convoId}/messages`,
        message.id
      );
      await updateDoc(messageDoc, {
        likes: arrayUnion(user?.uid),
      });
      getCacheLikes();
    } catch (error) {
      console.error(error);
    }
  };

  const unlikeMessage = async () => {
    try {
      const messageDoc = doc(
        db,
        `conversations/${convoId}/messages`,
        message.id
      );
      await updateDoc(messageDoc, {
        likes: arrayRemove(user?.uid),
      });
      getCacheLikes();
    } catch (error) {
      console.error(error);
    }
  };

  const getCacheLikes = async () => {
    try {
      const messageRef = doc(
        db,
        `conversations/${convoId}/messages`,
        message.id
      );
      const messageSnap = await getDocFromCache(messageRef);
      const messageDoc = {
        id: messageSnap.id,
        ...messageSnap.data(),
      } as MessageType;
      setMessageLikes(messageDoc);
    } catch (error) {
      console.error(error);
    }
  };

  const getMessageLikes = async () => {
    try {
      const messageRef = doc(
        db,
        `conversations/${convoId}/messages`,
        message.id
      );
      const messageDoc = await getDoc(messageRef);

      const messageData = {
        id: messageDoc.id,
        ...messageDoc.data(),
      } as MessageType;
      setMessageLikes(messageData);
    } catch (error) {
      console.log(error);
    }
  };

  const isLiked = messageLikes?.likes?.includes(user?.uid || "");

  useEffect(() => {
    getMessageLikes();
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
                  docDate={
                    message.sent
                      ? new Date(message.sent.seconds * 1000)
                      : new Date()
                  }
                />
              </p>
            </div>
          </div>
          <div className="flex items-end ml-2">
            {isVisible ? (
              <div className="flex gap-x-2">
                {isLiked ? (
                  <button
                    onClick={() => {
                      unlikeMessage();
                    }}
                  >
                    <div className="flex items-center gap-x-[1px]">
                      <img src={like} className="m-1" alt="like" />
                      <p className="text-gray-600">
                        {messageLikes?.likes?.length}
                      </p>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      likeMessage();
                    }}
                  >
                    <div className="flex items-center gap-x-[1px]">
                      <img src={unlike} className="m-1" alt="like" />
                      <p className="text-gray-600">
                        {messageLikes?.likes?.length}
                      </p>
                    </div>
                  </button>
                )}
                <button onClick={() => deleteMessage()}>
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
                {isLiked ? (
                  <button onClick={() => unlikeMessage()}>
                    <div className="flex items-center gap-x-[1px]">
                      <img src={like} className="m-1" alt="like" />
                      <p className="text-gray-600">
                        {messageLikes?.likes?.length}
                      </p>
                    </div>
                  </button>
                ) : (
                  <button onClick={() => likeMessage()}>
                    <div className="flex items-center gap-x-[1px]">
                      <img src={unlike} className="m-1" alt="like" />
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
                <TimeAndDate docDate={new Date(message.sent.seconds * 1000)} />
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
