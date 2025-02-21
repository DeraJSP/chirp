import { useEffect, useState } from "react";
import { MessageType } from "../../components/MessageType";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import PreviousPage from "../../components/PreviousPage";

export default function Message() {
  const [messages, setMessage] = useState<MessageType[] | null>(null);

  const [user] = useAuthState(auth);

  const getMessage = async () => {
    const messagesRef = collection(db, `users/${user?.uid}/conversations`);
    const data = await getDocs(messagesRef);

    const messageDoc = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MessageType[];
    setMessage(messageDoc);
  };

  useEffect(() => {
    getMessage();
  }, []);
  return (
    <>
      <PreviousPage page="Message" />
      {messages?.map((message) => (
        <div>
          <div>{message.id}</div>
        </div>
      ))}
    </>
  );
}
