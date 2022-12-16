import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import User from "../components/Interface";
import "./Users.css";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [cookies, removeCookie] = useCookies<string>([]);
  const [isShown, setIsShown] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const getAllUsers = async () => {
      if (!cookies.authorization) {
        navigate("/login");
      } else {
        const { data } = await axios.get("http://localhost:5000/api/users", {
          withCredentials: true,
        });
        let user = data.user.map((elem: User) => [
          elem.email,
          elem.isAdmin ? "Admin" : "User",
          elem._id,
        ]);
        setUsers(user);
      }
    };
    getAllUsers();
  }, [cookies, navigate, removeCookie]);

  const deleteUser = async (elem: string) => {
    axios.delete(`http://localhost:5000/api/users/findUser/${elem[2]}`, {
      withCredentials: true,
    });
    window.location.reload();
  };
  const handleClick = async (event: any) => {
    if (!event.detail || event.detail == 1) {
      if (isShown === false) {
        const data = await axios.get(
          `http://localhost:5000/api/users/findUser/${event[2]}`,
          {
            withCredentials: true,
          }
        );
        setText(data.data.user.email);
        setId(data.data.user._id);

        setIsShown(true);
      } else {
        setIsShown(false);
      }
    }
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      axios.patch(
        `http://localhost:5000/api/users/findUser/${id}`,
        {
          email,
          isAdmin,
        },
        { withCredentials: true }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-wrapper">
      <div className="table-title">
        <h2>Manage Users</h2>
      </div>
      {isShown && (
        <div className="container">
          <div className="header">
            <h2>Edit {text} account</h2>
          </div>
          <form id="form" className="form" onSubmit={(e) => handleSubmit(e)}>
            <div className="form-control">
              <TextField
                sx={{ m: 0, minWidth: 400 }}
                id="outlined-name"
                label="Edit Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-control">
              <FormControl sx={{ m: 0, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Role
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={isAdmin}
                  label="Select Role"
                  autoWidth
                  onChange={(e) => setIsAdmin(e.target.value)}
                >
                  <MenuItem value={"true"}>Admin</MenuItem>
                  <MenuItem value={"false"}>User</MenuItem>
                </Select>
              </FormControl>
            </div>
            <button className="buttonFront" type="submit">
              Edit
            </button>
            <button className="buttonFront" onClick={(e) => setIsShown(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
      {!isShown && (
        <table className="table">
          <tbody>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
            {users.map((item: string, index: number) => {
              return [
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                  <td>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteUser(item)}
                      startIcon={<DeleteIcon />}
                    ></Button>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleClick(item)}
                      endIcon={<SendIcon />}
                    ></Button>
                  </td>
                </tr>,
              ];
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
