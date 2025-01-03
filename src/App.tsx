import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/main/Home";
import { Login } from "./pages/Login";
import { Contact } from "./pages/Contact";
import { Navbar } from "./components/Navbar";
import CreatePost from "./pages/create-post/CreatePost";
import "./App.css";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          {<Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/createpost" element={<CreatePost />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}
export default App;
