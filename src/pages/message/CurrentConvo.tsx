import { useLocation } from "react-router-dom";
import PreviousPage from "../../components/PreviousPage";
import { useEffect, useState } from "react";
import { ConversationType } from "../../components/ConversationType";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function CurrentConvo() {
  const [currentConvo, setCurrentConvo] = useState<ConversationType | null>(
    null
  );
  const location = useLocation();
  const getMessages = async () => {
    setCurrentConvo(location.state.currentConvo);

    try {
      const messagesRef = collection(db, "messages");
      const data = await getDocs(messagesRef);

      const messagesDoc = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ConversationType[];
      setCurrentConvo(messagesDoc);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);
  return (
    <>
      <div>
        {" "}
        <PreviousPage page="Message" />
      </div>
    </>
  );
}
