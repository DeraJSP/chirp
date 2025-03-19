import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";

export default function useFetchDoc<T>(
  col: string,
  firstField: string,
  secondField: string,
  trigger: string
) {
  const [data, setData] = useState<T[] | null>(null);

  const getDoc = async () => {
    try {
      const querySnapshot = query(
        collection(db, col),
        where(firstField, "==", secondField)
      );

      const dataArr = await getDocs(querySnapshot);
      const doc = dataArr.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      setData(doc);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDoc();
  }, [trigger]);

  return { data };
}
