import { useState } from "react";
import { Link } from "react-router-dom";

export default function SideBar() {
  const [sideBar, setSideBar] = useState(false);
  const showSideBar = () => setSideBar(!sideBar);
  return (
    <>
      <section>
        <div className="border-2 border-black w-14">
          <div>
            <button onClick={showSideBar}>X</button>
          </div>
          <nav
            className={
              sideBar
                ? "left-0 transition-[450ms]"
                : "fixed top-0 left-[-100%] transition-[850ms]"
            }
          >
            <ul onClick={showSideBar}>
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
