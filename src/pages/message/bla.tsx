import React from "react";

export default function bla() {
  useEffect(() => {
    const getMessages = async () => {
      try {
        setCurrentConvo(location.state.currentConvo);

        const messagesRef = collection(
          db,
          `conversations/${currentConvo?.id}/messages`
        );
        const querySnapshot = query(messagesRef, orderBy("sent"));

        const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
          const messagesDoc = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setConvoMessages(messagesDoc);
        });

        // Return the cleanup function to unsubscribe
        return () => {
          unsubscribe();
          console.log("Cleanup ran");
        };
      } catch (error) {
        console.log(error);
      }
    };

    // Call the getMessages function
    const cleanup = getMessages();

    // Cleanup function to unsubscribe
    return () => {
      if (cleanup) cleanup();
    };
  }, [location.state.currentConvo]);
  return <div>bla</div>;
}
