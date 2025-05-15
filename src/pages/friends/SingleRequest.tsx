import { FriendType } from "../../components/types/FriendType";
import { db } from "../../config/firebase";
import useDeleteDoc from "../../components/hooks/useDeleteDoc";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import TimeAndDate from "../../components/TimeAndDate";
import { Link } from "react-router-dom";

export default function SingleRequest(props: { request: FriendType }) {
  const { request } = props;
  const { delDoc: cancelRequest } = useDeleteDoc("friends", request.id);

  const acceptRequest = async () => {
    try {
      const querySnapshot = doc(db, "friends", request.id);
      await updateDoc(querySnapshot, {
        status: "accepted",
        acceptedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const requestDate = () => {
    return request.sentAt
      ? new Date(request.sentAt.seconds * 1000)
      : new Date();
  };

  return (
    <>
      <div className="flex items-center justify-between gap-x-2 text-gray-700 border-b-[1px] hover:border-0 hover:bg-cGray-50 hover:rounded-2xl p-2">
        <Link to={`/profile/${request.senderId}`}>
          <div className="flex items-center justify-center gap-x-2 text-gray-700">
            <img
              src={request.senderPhoto}
              alt="Friend photo"
              referrerPolicy="no-referrer"
              className="rounded-full w-12"
            />
            <div className="flex flex-col justify-center">
              <p className="font-bold">{request.senderUsername}</p>{" "}
              <p className="text-gray-500">
                sent at <TimeAndDate docDate={requestDate()} />
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center justify-center gap-x-2">
          <button
            onClick={acceptRequest}
            className="hover:bg-cBlue-100 border border-cBlue-200 mb-3 px-3 py-1 rounded-xl font-bold hover:text-gray-800 text-gray-600"
          >
            Accept
          </button>
          <button
            onClick={cancelRequest}
            className="hover:bg-orange-100 hover:border-orange-600 border border-orange-400  mb-3 px-3 py-1 rounded-xl font-bold hover:text-gray-800 text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
