import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import logout from "./img/logout.svg";
import add from "./img/add.svg";
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
            {/* if user photo is null show an empty string */}
            <div>
              <Link to="/message">message</Link>
            </div>
            <div className="flex items-center justify-center gap-x-1">
              <img
                src={user?.photoURL || ""}
                alt="profile picture thumbnail"
                referrerPolicy="no-referrer"
                className="rounded-full w-8"
              />
              <p className="font-bold">{user?.displayName}</p>
            </div>
            <div className="flex items-center justify-center gap-x-2">
              <button onClick={() => setShowPostForm(!showPostForm)}>
                <img
                  src={add}
                  alt="create post"
                  className="w-7"
                  title="Create post"
                />
              </button>
              <div>
                {showPostForm && user?.uid ? (
                  <CreatePost
                    setShowPostForm={setShowPostForm}
                    showPostForm={showPostForm}
                  />
                ) : null}
              </div>
              <button onClick={signUserOut}>
                <img
                  src={logout}
                  alt="sign out"
                  className="w-6"
                  title="Sign out"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
