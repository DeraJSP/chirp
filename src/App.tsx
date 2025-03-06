import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/main/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Message from "./pages/message/Message";
import CurrentConvo from "./pages/message/CurrentConvo";
import { Navbar } from "./components/Navbar";
import CreatePost from "./pages/create-post/CreatePost";
import "./App.css";
import CurrentPost from "./pages/comment/CurrentPost";

// import SideBar from "./components/SideBar";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <div className="sticky top-0"> {<Navbar />}</div>
          <div className="">
            {/* <div className="sticky top-0">{<SideBar />}</div> */}
            <div>
              <Routes>
                <Route path="*" element={<p>There's nothing here!</p>} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/post" element={<CurrentPost />}>
                  <Route path=":postId" element={<CurrentPost />} />
                </Route>

                <Route path="/profile" element={<Profile />}>
                  <Route path=":userId" element={<Profile />} />
                </Route>
                <Route path="/message" element={<Message />} />
                <Route path="/conversation" element={<CurrentConvo />}>
                  <Route path=":convoId" element={<CurrentConvo />} />
                </Route>
                <Route path="/createpost" element={<CreatePost />} />
              </Routes>
            </div>
          </div>
        </Router>
      </div>
    </>
  );
}
export default App;
