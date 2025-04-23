import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useState } from "react";

export default function useFetchDoc<T>(col: string) {
  const [data, setData] = useState<T[] | null>(null);

  const getDoc = async (firstField: string, secondField: string) => {
    try {
      const querySnapshot = query(
        collection(db, col),
        where(firstField, "==", secondField)
      );
      const dataArr = await getDocs(querySnapshot);
      const docData = dataArr.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      setData(docData);
    } catch (error) {
      console.error(error);
    }
  };

  const getCacheDoc = () => {
    try {
      const colRef = collection(db, col);
      const unsubscribe = onSnapshot(
        colRef,
        { source: "cache" },
        (snapshot) => {
          const docData = snapshot.docs.map((doc) => ({
            ...doc.data(),
          })) as T[];

          setData(docData);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  return { data, setData, getDoc, getCacheDoc };
}
