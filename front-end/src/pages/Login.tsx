import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "./Register-Login.css";

export default function Login() {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cookies] = useCookies<string>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.authorization) {
      navigate("/");
    }
  }, [cookies, navigate]);

  const generateError = (error: any) =>
    toast.error(error, {
      position: "bottom-right",
    });
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (data) {
        if (data.errors) {
          const { msg, status } = data.errors;
          if (msg) generateError(msg);
          else if (status) generateError(status);
        } else {
          // localStorage.setItem("authorization", data.token);
          navigate("/");
          window.location.reload();
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <div className="container">
      <div className="header">
        <h2>Login</h2>
      </div>
      <form id="form" className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="form-control">
          <label>Your email:</label>
          <input
            type="text"
            id="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Your password:</label>
          <input
            type="password"
            id="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="buttonFront" type="submit">Login</button>
        {/* <button onClick={getUser}>Get user</button> */}
        <span>
          Don't have an account?<Link to="/register"> Register</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}
