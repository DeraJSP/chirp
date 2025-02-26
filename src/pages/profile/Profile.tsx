import { auth, db } from "../../config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../main/Post";
import { PostType } from "../../components/PostType";
import cover from "./img/cover.png";
import addfriend from "./img/add_friend.svg";
import friends from "./img/friends.svg";
import birthday from "./img/birthday.svg";
import location from "./img/location.svg";
import calender from "./img/calender.svg";
import message from "./img/message.svg";
import PreviousPage from "../../components/PreviousPage";
import CreateMessage from "../message/CreateMessage";
import { useAuthState } from "react-firebase-hooks/auth";
import { ProfileType } from "../../components/ProfileType";

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileType | null>(null);
  const [toggleState, setToggleState] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const params = useParams<{ userId: string }>();
  const profileUid = params.userId || "";
  const [user] = useAuthState(auth);

  const getProfileData = async () => {
    const userRef = doc(db, "users", profileUid);
    const userDoc = await getDoc(userRef);
    setProfileData({ ...userDoc.data() } as ProfileType);
  };

  const [postList, setPostList] = useState<PostType[] | null>(null);
  const getPost = async () => {
    const postsRef = collection(db, `users/${profileUid}/posts`);
    const data = await getDocs(postsRef);

    const postDoc = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PostType[];
    setPostList(postDoc);
  };

  const sendRequest = async () => {
    const senderRef = collection(db, `users/${user?.uid}/friends`);
    const receieverRef = collection(db, `users/${profileUid}/friends`);
    const refArr = [senderRef, receieverRef];

    await Promise.all(
      refArr?.map(async (ref) => {
        await addDoc(ref, {
          senderId: user?.uid,
          senderUsername: user?.displayName,
          senderPhoto: user?.photoURL,
          receiverId: profileUid,
          accepted: false,
          createdAt: serverTimestamp(),
        });
      })
    );
  };

  useEffect(() => {
    getProfileData();
    getPost();
  }, []);

  return (
    <>
      <PreviousPage page="Profile" />
      <section>
        <div className="relative">
          <div className="mx-auto ">
            <img src={cover} className="mx-auto" alt="cover photo" />
          </div>
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
            <img
              src={profileData?.userPhoto}
              className="w-40 rounded-full mx-auto border-8 border-white"
              alt="profile photo"
            />
            <p className="text-2xl font-bold text-center text-white mt-4">
              {profileData?.username}
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="w-1/2 mx-auto mt-8">
          <div>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat
              sequi corporis similique doloremque nemo incidunt atque illum
              reiciendis ab animi eos cum quisquam aliquam quidem totam, fugiat
              beatae minus quam?
            </p>
            <div className="flex flex-col gap-y-3 mt-10">
              <div className="flex gap-x-5">
                <div>
                  <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="hover:bg-cBlue-100 border border-cBlue-200 mb-3 px-3 py-1 rounded-xl font-bold text-gray-700"
                  >
                    <div className="flex items-center gap-x-3">
                      <img src={message} alt="Message icon" />
                      <p>Message</p>
                    </div>
                  </button>
                  <div>
                    {isVisible ? (
                      <CreateMessage
                        setIsVisible={setIsVisible}
                        isVisible={isVisible}
                        profileData={profileData as ProfileType}
                      />
                    ) : null}
                  </div>
                </div>
                <div>
                  <button
                    onClick={sendRequest}
                    className="hover:bg-cBlue-100 border border-cBlue-200 mb-3 px-3 py-1 rounded-xl font-bold text-gray-700"
                  >
                    <div className="flex items-center gap-x-3">
                      <img src={addfriend} alt="Add friend icon" />
                      <p>Add friend</p>
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-x-3 gap-x-2">
                <img src={calender} alt="calender icon" />
                <p className="text-gray-600">
                  Joined: <span className="ml-2">{profileData?.email}</span>
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-x-3">
                  <img src={friends} alt="Friends icon" />
                  <p className="text-gray-600">
                    Friends:<span className="ml-2">{profileData?.email}</span>
                  </p>{" "}
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <img src={birthday} alt="" />
                <p className="text-gray-600">
                  Birthday: <span className="ml-2">{profileData?.email}</span>
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                {" "}
                <img src={location} alt="" />
                <p className="text-gray-600">
                  Location: <span className="ml-2">{profileData?.email}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-5 w-2/5 my-10">
          <div className="flex justify-center gap-x-10">
            <button
              onClick={() => setToggleState(1)}
              className={
                toggleState === 1
                  ? "w-16 border-b-4 border-cBlue-200 p-2 font-bold text-gray-800"
                  : "p-3 font-bold text-gray-500 hover:bg-gray-200 hover:rounded-xl"
              }
            >
              <p>Posts</p>
            </button>
            <button
              onClick={() => setToggleState(2)}
              className={
                toggleState === 2
                  ? "w-16 border-b-4 border-cBlue-200 p-2 font-bold text-gray-800 hover:bg-gray-200-rounded-xl"
                  : "p-3 font-bold text-gray-500 hover:bg-gray-200 hover:rounded-xl"
              }
            >
              <p>Friends</p>
            </button>{" "}
          </div>
          {toggleState === 1 ? (
            postList?.map((post) => <Post key={post.id} {...post} />)
          ) : (
            <div>Friends</div>
          )}
        </div>
      </section>{" "}
    </>
  );
}
