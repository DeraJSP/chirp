import { FriendType } from "../../components/types/FriendType";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import useDeleteDoc from "../../components/hooks/useDeleteDoc";
import TimeAndDate from "../../components/TimeAndDate";
import { Link } from "react-router-dom";
import { ProfileType } from "../../components/types/ProfileType";

export default function Friend(props: {
  friend: FriendType;
  profileData: ProfileType;
}) {
  const { friend, profileData } = props;
  const [user] = useAuthState(auth);
  const { delDoc: deleteFriend } = useDeleteDoc("friends", friend.id);

  const friendId =
    friend.senderId === profileData.id ? friend.receiverId : friend.senderId;

  const friendPhoto =
    friend.senderPhoto === profileData.userPhoto
      ? friend.receiverPhoto
      : friend.senderPhoto;

  const friendUsername =
    friend.senderUsername === profileData.username
      ? friend.receiverUsername
      : friend.senderUsername;

  const acceptanceDate = () => {
    return friend.acceptedAt
      ? new Date(friend.acceptedAt.seconds * 1000)
      : new Date();
  };

  return (
    <>
      <div className="flex items-center justify-between gap-x-2 text-gray-700 border-b-[1px] hover:bg-cGray-50 hover:border-0 hover:rounded-2xl p-2">
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
                friend since <TimeAndDate docDate={acceptanceDate()} />
              </p>
            </div>
          </div>
        </Link>

        {profileData.id == user?.uid ? (
          <div className="flex items-center justify-center gap-x-2">
            <button
              onClick={deleteFriend}
              className="hover:bg-orange-100 hover:border-orange-600 border border-orange-400 mb-3 px-3 py-1 rounded-xl font-bold hover:text-gray-700 text-gray-600"
            >
              Unfriend
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
