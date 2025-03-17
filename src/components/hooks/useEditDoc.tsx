import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect } from "react";

export default function useEditDoc(
  content: string,
  docId: string,
  col: string
) {
  const editDoc = async () => {
    try {
      const querySnapshot = doc(db, col, docId);
      await updateDoc(querySnapshot, {
        description: content,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    editDoc();
  }, [col, docId]);

  return null;
}
