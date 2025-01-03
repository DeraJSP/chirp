import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export const Navbar = () => {
  const [user] = useAuthState(auth);

  const signUserOut = async () => {
    await signOut(auth);
  };
  return (
    <>
      <div>
        <Link to="/">Home</Link>
        <br />

        {!user ? (
          <div>
            <Link to="/login">Login</Link>
          </div>
        ) : (
          <div>
            <Link to="/contact">Contact</Link> <br />
            <Link to="/createpost">Create Post</Link>
            <br />
            <button onClick={signUserOut}>Sign Out</button>
          </div>
        )}
      </div>
    </>
  );
};
