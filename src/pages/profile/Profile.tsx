import { auth, db } from "../../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../main/Post";
import { PostType } from "../../components/types/PostType";
import cover from "./img/cover.png";
import friends_icon from "./img/friends.svg";
import birthday from "./img/birthday.svg";
import location from "./img/location.svg";
import calender from "./img/calender.svg";
import message from "./img/message.svg";
import PreviousPage from "../../components/PreviousPage";
import CreateMessage from "../message/CreateMessage";
import FriendRequests from "./FriendRequests";
import Friends from "./Friends";
import { useAuthState } from "react-firebase-hooks/auth";
import EditProfile from "./EditProfile";
import { UserType } from "../../components/types/UserType";
import TimeAndDate from "../../components/TimeAndDate";

export default function Profile() {
  const [profileData, setProfileData] = useState<UserType | null>(null);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [toggleState, setToggleState] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [postList, setPostList] = useState<PostType[] | null>(null);
  // const [friends, setFriendsList] = useState<FriendType[] | null>(null);

  const params = useParams<{ userId: string }>();
  const profileUid = params.userId || "";
  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  // const userId = user?.uid || null;
  // const usersIdArr = [user?.uid, profileData?.id];
  // const userIdPair = usersIdArr.sort().join("");
  const [user] = useAuthState(auth);

  const getProfileData = async () => {
    try {
      const docRef = doc(db, "users", profileUid);
      const docSnap = await getDoc(docRef);
      setProfileData({ ...docSnap.data() } as UserType);
    } catch (error) {
      console.error(error);
    }
  };

  const getPost = async () => {
    try {
      const querySnapshot = query(
        collection(db, "posts"),
        where("userId", "==", profileUid)
      );
      const data = await getDocs(querySnapshot);

      const postDoc = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PostType[];
      setPostList(postDoc);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserData = async () => {
    try {
      if (user?.uid == profileUid) {
        const docSnap = doc(db, `users/${user?.uid}`);
        const data = await getDoc(docSnap);

        const userDoc = {
          ...data.data(),
        } as UserType;
        setUserData(userDoc);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileData();
    getPost();
  }, [profileUid]);

  useEffect(() => {
    getUserData();
  }, [user?.uid]);

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
            <p>{profileData?.bio}</p>
            <div className="flex flex-col gap-y-3 mt-5">
              {user?.uid == profileUid ? (
                <div className="mb-3">
                  <button
                    onClick={() => setShowProfileEdit(!showProfileEdit)}
                    className="hover:bg-cBlue-100 border border-cBlue-200 px-3 py-1 rounded-xl font-bold text-gray-700"
                  >
                    Edit Profile
                  </button>
                  <div>
                    {showProfileEdit && userData ? (
                      <EditProfile
                        setShowProfileEdit={setShowProfileEdit}
                        showProfileEdit={showProfileEdit}
                        userData={userData}
                      />
                    ) : null}
                  </div>
                </div>
              ) : (
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
                      {isVisible && profileData ? (
                        <CreateMessage
                          setIsVisible={setIsVisible}
                          isVisible={isVisible}
                          profileData={profileData}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div>
                    {profileData && (
                      <FriendRequests profileData={profileData} />
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-x-3 gap-x-2">
                <img src={calender} alt="calender icon" />
                <p className="text-gray-600">
                  Joined:{" "}
                  <span className="ml-2">
                    {
                      <TimeAndDate
                        docDate={
                          profileData?.joinedAt
                            ? new Date(profileData?.joinedAt.seconds * 1000)
                            : new Date()
                        }
                      />
                    }
                  </span>
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-x-3">
                  <img src={friends_icon} alt="Friends icon" />
                  <p className="text-gray-600">
                    Friends:<span className="ml-2">{profileData?.email}</span>
                  </p>{" "}
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <img src={birthday} alt="" />
                <p className="text-gray-600">
                  Birthday:{" "}
                  <span className="ml-2">{profileData?.birthday}</span>
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                <img src={location} alt="" />
                <p className="text-gray-600">
                  Location:{" "}
                  <span className="ml-2">{profileData?.location}</span>
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
            </button>
          </div>
          {toggleState === 1 ? (
            postList?.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <div className="w-full">
              {profileData && <Friends profileData={profileData} />}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
