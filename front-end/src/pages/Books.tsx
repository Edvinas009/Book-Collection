import React, { useState, useEffect, Component } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";
import "../";

export default function Books() {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [pageCount, setPageCount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState({ preview: "", data: "" });

  const generateError = (error: string) =>
    toast.error(error, {
      position: "bottom-right",
    });

  const handleFileChange = (e: any) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImageUrl(img);

    const formData = new FormData();
    formData.append("file", img.data);
    axios
      .post("http://localhost:5000/api/books/uploadImage", formData, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("File Upload success");
        setImage(`http://localhost:5000/img/${img.data.name}`);
      })
      .catch((err) => console.log("File Upload Error"));
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/books",
        {
          title,
          pageCount,
          description,
          author,
          image,
        },
        {
          withCredentials: true,
        }
      );
      if (data) {
        if (data.errors) {
          const { msg, status } = data.errors;
          if (msg) generateError(msg);
          else if (status) generateError(status);
        } else {
          navigate("/");
          window.location.reload();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Add New Book</h2>
      </div>
      <form id="form" className="form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Book title:</label>
          <input
            type="text"
            id="title"
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Page count:</label>
          <input
            type="text"
            id="PageCount"
            placeholder="Page count"
            onChange={(e) => setPageCount(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Description:</label>
          <input
            type="text"
            id="setDescription"
            placeholder="Descriptiont"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Author:</label>
          <input
            type="text"
            id="setAuthor"
            placeholder="Author"
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Image: </label>
          {imageUrl.preview && (
            <img src={imageUrl.preview} width="100" height="100" />
          )}
          <hr></hr>
        </div>
        <Stack alignItems="center" spacing={2}>
          <IconButton
            color="inherit"
            aria-label="upload picture"
            component="label"
          >
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleFileChange}
            />
            <PhotoCamera />
          </IconButton>
          <Button
            type="submit"
            variant="outlined"
            color="inherit"
            endIcon={<SendIcon />}
          >
            Send
          </Button>
          {/* <button type="submit">Add book</button> */}
        </Stack>
      </form>
      <ToastContainer />
    </div>
  );
}
