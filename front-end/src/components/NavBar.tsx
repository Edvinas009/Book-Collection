import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies<string>([]);
  const [value, setValue] = useState<string>("");

  // useEffect(() => {
  //   if (!cookies.authorization) {
  //     navigate("/login");
  //   }
  // }, [cookies, navigate]);

  const token = cookies.authorization;

  const logOut = () => {
    removeCookie("authorization");
    navigate("/login");
    window.location.reload();
  };
  return (
    <div className="TopNav">
      {token ? (
        <>
          <Link to="/">Home</Link>
          <Link to="/books">Add book</Link>
          <Link to="/find">Find book</Link>
          <Link to="/login">
            <button type="button" onClick={logOut} id="RightButton">
              Logout
            </button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
}
