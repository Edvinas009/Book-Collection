import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useContext } from "react";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar";
import "./index.css";
import Books from "./pages/Books";
import FindBook from "./pages/FindBook";
import Users from "./pages/Users";

export default function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/books" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/find" element={<FindBook />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </div>
  );
}
