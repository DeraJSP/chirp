import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import logout from "./img/logout.svg";
import add from "./img/add.svg";
import message from "../pages/profile/img/message.svg";
import friends from "./img/friends.svg";
import { CreatePost } from "../pages/main/CreatePost";
import { useState } from "react";

export const Navbar = () => {
  const [user] = useAuthState(auth);
  const [showPostForm, setShowPostForm] = useState(false);
  const navigate = useNavigate();
  const signUserOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <>
      <div className="flex items-center justify-between py-3 px-10 bg-cBlue-100 border-b border-cBlue-200 shadow-lg">
        <Link to="/">
          <h1 className="text-2xl font-black">Chirp!</h1>
        </Link>

        {!user ? (
          <div>
            <Link to="/login">Login</Link>
          </div>
        ) : (
          <div className="flex items-center gap-x-10">
            <div className="flex items-center justify-center gap-x-1">
              <img
                src={user?.photoURL || ""}
                alt="profile picture thumbnail"
                referrerPolicy="no-referrer"
                className="rounded-full w-8"
              />
              <p className="font-bold">{user?.displayName}</p>
            </div>
            <div className="flex items-center justify-center gap-x-4">
              <button onClick={() => setShowPostForm(!showPostForm)}>
                <img
                  src={add}
                  alt="create post"
                  className="w-7"
                  title="Create post"
                />
              </button>

              {showPostForm && user?.uid ? (
                <div>
                  <CreatePost
                    setShowPostForm={setShowPostForm}
                    showPostForm={showPostForm}
                  />{" "}
                </div>
              ) : null}
              <button>
                <Link to="/message">
                  {" "}
                  <img
                    src={message}
                    alt="inbox"
                    className="w-7"
                    title="messages"
                  />
                </Link>
              </button>
              <button>
                {" "}
                <Link to="/friends">
                  <img
                    src={friends}
                    alt="friends"
                    className="w-7"
                    title="manage friends"
                  />
                </Link>
              </button>
              <button onClick={signUserOut}>
                <img
                  src={logout}
                  alt="log out"
                  title="log out"
                  className="w-7"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
