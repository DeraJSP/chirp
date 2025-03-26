import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function useEditDoc() {
  const editDoc = async (col: string, docId: string, value: string) => {
    try {
      const querySnapshot = doc(db, col, docId);
      await updateDoc(querySnapshot, {
        content: value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return { editDoc };
}
