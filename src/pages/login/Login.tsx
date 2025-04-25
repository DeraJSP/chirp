import { auth, db, provider } from "../../config/firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import cactus from "./img/cactus.svg";
import relax from "./img/relax.svg";
import google from "./img/google.svg";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const authObj = await signInWithPopup(auth, provider);
    const docSnap = doc(db, `users/${authObj.user?.uid}`);

    if (!docSnap) {
      await setDoc(docSnap, {
        id: authObj.user?.uid,
        email: authObj.user?.email,
        username: authObj.user?.displayName,
        userPhoto: authObj.user?.photoURL,
        bio: "",
        location: "",
        birthday: "",
        joinedAt: serverTimestamp(),
      });
      navigate("/");
    } else {
      return navigate("/");
    }
  };

  return (
    <>
      <main className="bg-gradient-to-r from-[#0083B0]/65 to-[#DB009E]/55">
        <section className="flex items-center justify-center h-screen">
          <div className="flex items-center justify-around bg-gray-200 rounded-3xl w-2/3 py-5 h-2/3 shadow-[0_0_20px_1px_rgba(0,0,0,0.2)]">
            <div className="">
              <button
                onClick={signInWithGoogle}
                className="rounded-2xl border border-[#0083B0] hover:bg-[#C0DBEA] flex items-center justify-center w-80 gap-x-4 p-2"
              >
                <img src={google} alt="google logo" className="size-16" />
                <p>Google Sign In</p>
              </button>
            </div>
            <div className="flex items-center justify-center gap-x-0 static border border-red-500">
              <img
                src={relax}
                className="absolute right-80 size-[500px]"
                alt="Woman working on a laptop"
              />
              <img src={cactus} className="size-[250px]" alt="A cactus plant" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
