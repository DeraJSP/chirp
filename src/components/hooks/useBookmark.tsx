import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function useBookmark(fieldName: string, docId: string) {
  const [isSaved, setIsSaved] = useState(false);
  const [user] = useAuthState(auth);

  const addBookmark = async () => {
    try {
      const bookmarksRef = collection(db, "bookmarks");
      await addDoc(bookmarksRef, {
        [fieldName]: docId,
        userId: user?.uid,
        createdAt: serverTimestamp(),
      });
      setIsSaved(true);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const getBookmarks = async () => {
    try {
      const querySnapshot = query(
        collection(db, "bookmarks"),
        where(fieldName, "==", docId),
        where("userId", "==", user?.uid)
      );
      const data = await getDocs(querySnapshot);
      return data.empty ? setIsSaved(false) : setIsSaved(true);
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const delBookmark = async () => {
    try {
      const querySnapshot = query(
        collection(db, "bookmarks"),
        where(fieldName, "==", docId),
        where("userId", "==", user?.uid)
      );
      const data = await getDocs(querySnapshot);
      await deleteDoc(doc(db, "bookmarks", data.docs[0].id));
      setIsSaved(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBookmarks();
  }, []);
  return { addBookmark, delBookmark, isSaved };
}
