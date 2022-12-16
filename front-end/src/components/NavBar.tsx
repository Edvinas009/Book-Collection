import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies<string>([]);
  const [isAdmin, setIsAdmin] = useState<Boolean>();

  const token = cookies.authorization;

  useEffect(() => {
    const getCurrentUser = async () => {
      if (!cookies.authorization) {
        // navigate("/login");
      } else {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/currentUser",
          {
            withCredentials: true,
          }
        );
        setIsAdmin(data.user.isAdmin);
      }
    };
    getCurrentUser();
  }, [cookies, navigate, removeCookie]);

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const logOut = async () => {
    await timeout(100);
    navigate("/login");
    removeCookie("authorization");
    window.location.reload();
  };
  return (
    <div className="TopNav">
      {token ? (
        <>
          <Link to="/">Home</Link>
          {isAdmin ? <Link to="/users">Users</Link> : <></>}
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
