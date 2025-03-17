import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect } from "react";

export default function useDeleteDoc(col: string, docId: string) {
  const delDoc = async () => {
    try {
      await deleteDoc(doc(db, col, docId));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    delDoc();
  }, [col, docId]);

  return { delDoc };
}
