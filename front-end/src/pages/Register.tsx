import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
// import "./Register-Login.css";

export default function Register() {
  const navigate = useNavigate();
  const [value, setValue] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const generateError = (err: string) => {
    toast.error(err, {
      position: "bottom-right",
    });
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);

      if (data) {
        if (data.errors) {
          const { msg } = data.errors;
          console.log(data.errors);
          if (msg) generateError(msg);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Register</h2>
      </div>
      <form id="form" className="form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Your username:</label>
          <input
            type="text"
            id="username"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
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
          <i className="fas fa-check-circle"></i>
          <i className="fas fa-exclamation-circle"></i>
          <small></small>
        </div>
        <button className="buttonFront" type="submit">
          Register
        </button>
        <span>
          Already have an account ?
          <Link
            to="/login"
            style={{ textDecoration: "none", fontWeight: "bold" }}
          >
            {" "}
            Login
          </Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}
