import { FriendType } from "../../components/types/FriendType";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import useDeleteDoc from "../../components/hooks/useDeleteDoc";
import TimeAndDate from "../../components/TimeAndDate";
import { Link } from "react-router-dom";

export default function Friend(props: { friend: FriendType }) {
  const { friend } = props;
  const [user] = useAuthState(auth);
  const { delDoc: deleteFriend } = useDeleteDoc("friends", friend.id);

  const friendPhoto =
    friend.senderPhoto === user?.photoURL
      ? friend.receiverPhoto
      : friend.senderPhoto;

  const friendUsername =
    friend.senderUsername === user?.displayName
      ? friend.receiverUsername
      : friend.senderUsername;

  const acceptedDate = () => {
    return friend.acceptedAt
      ? new Date(friend.acceptedAt.seconds * 1000)
      : new Date();
  };
  const friendId =
    friend.senderId === user?.uid ? friend.receiverId : friend.senderId;

  return (
    <>
      <div className="flex items-center justify-between gap-x-2 text-gray-700 border-b-[1px] hover:bg-cGray-50 hover:rounded-2xl p-2">
        <Link to={`/profile/${friendId}`}>
          {" "}
          <div className="flex items-center justify-center gap-x-2 text-gray-700">
            <img
              src={friendPhoto}
              alt="friend photo"
              referrerPolicy="no-referrer"
              className="rounded-full w-12"
            />
            <div className="flex flex-col justify-center">
              <p className="font-bold">{friendUsername}</p>
              <p className="text-gray-500">
                friend since <TimeAndDate docDate={acceptedDate()} />
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center justify-center gap-x-2">
          <button
            onClick={deleteFriend}
            className="hover:bg-orange-200 border border-orange-600 mb-3 px-3 py-1 rounded-xl font-bold text-gray-700"
          >
            Unfriend
          </button>
        </div>
      </div>
    </>
  );
}
