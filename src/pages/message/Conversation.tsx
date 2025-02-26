import { Link } from "react-router-dom";
import { ConversationType } from "../../components/ConversationType";
import TimeAndDate from "../../components/TimeAndDate";

export default function Conversation(props: ConversationType) {
  const { role, ...convo } = props;

  // const participantId = role === "sender" ? convo.senderId : convo.recipientId;
  const participantPhoto =
    role === "sender" ? convo.senderUserPhoto : convo.recipientUserPhoto;
  const participantUsername =
    role === "sender" ? convo.senderUsername : convo.recipientUsername;
  const sentDate = new Date(convo.lastMessage.sent.seconds * 1000);

  return (
    <>
      {" "}
      <div
        className="w-full p-3 border-[1px] border-cGray-100 rounded-2xl bg-white"
        key={convo.id}
      >
        <div className="flex items-center justify-items gap-x-2">
          <img
            src={participantPhoto}
            alt="profile picture thumbnail"
            className="rounded-full w-14"
          />
          <div className="flex flex-col overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to={`/message/${convo.id}`}>
              <div className="flex justify-between">
                <p className="font-bold text-lg text-gray-700">
                  {participantUsername}
                </p>
                <p className="text-gray-700">
                  <TimeAndDate postDate={sentDate} />
                </p>
              </div>
              <div className="text-gray-600 italic w-full">
                <p>{convo.lastMessage.content}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
