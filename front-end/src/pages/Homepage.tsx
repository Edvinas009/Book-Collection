import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Homepage.css";
import { Button, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";

export default function Homepage() {
  const navigate = useNavigate();
  const [image, setImage] = useState<any>([]);
  const [description, setdescription] = useState<any>([]);
  const [title, setTitle] = useState<any>([]);
  const [id, setId] = useState([]);
  const [author, setAuthor] = useState<any>([]);
  const [cookies, removeCookie] = useCookies<string>([]);
  const [thumbnails, setThumnails] = useState([]);
  const [desc, setDesc] = useState([]);
  const [name, setName] = useState([]);
  const [bookId, setBookId] = useState([]);
  const [authorName, setAuthorName] = useState([]);
  const [previousSlideStyle, setPreviousSlideStyle] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDescription, setCurrentDescription] = useState(0);
  const [currentTitle, setCurrentTitle] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [currentAuthorName, setCurrentAuthorName] = useState(0);
  const [nextSlideStyle, setNextSlideStyle] = useState({});
  const [currentSlideStyle, setCurrentSlideStyle] = useState({});
  const [books, setBooks] = useState([]);
  const [isShown, setIsShown] = useState(false);
  let interval = 100000;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!event.detail || event.detail == 1) {
      if (isShown === false) {
        setIsShown(true);
      } else {
        setIsShown(false);
      }
    }
  }

  useEffect(() => {
    setThumnails(image);
    setDesc(description);
    setName(title);
    setAuthorName(author);
    setBookId(id);

    setCurrentSlideStyle({
      backgroundImage: "url('" + image[currentSlide] + "')",
    });
    if (currentSlide > 0) {
      setPreviousSlideStyle({
        backgroundImage: "url('" + image[currentSlide - 1] + "')",
      });
    } else {
      setPreviousSlideStyle({
        backgroundImage: "url('" + image[image.length - 1] + "')",
      });
    }

    if (currentSlide === image.length - 1) {
      setNextSlideStyle({
        backgroundImage: "url('" + image[0] + "')",
      });
    } else {
      setNextSlideStyle({
        backgroundImage: "url('" + image[currentSlide + 1] + "')",
      });
    }

    const loop = setInterval(() => {
      if (currentSlide === image.length - 1) {
        setCurrentSlide(0);
        setCurrentDescription(0);
        setCurrentTitle(0);
        setCurrentId(0);
        setCurrentAuthorName(0);
      } else {
        setCurrentSlide(currentSlide + 1);
        setCurrentDescription(currentDescription + 1);
        setCurrentTitle(currentTitle + 1);
        setCurrentId(currentId + 1);
        setCurrentAuthorName(currentAuthorName + 1);
      }
    }, interval);
    return () => clearInterval(loop);
  }, [
    image,
    currentSlide,
    description,
    currentDescription,
    title,
    currentTitle,
    id,
    currentId,
    author,
    currentAuthorName,
    interval,
  ]);

  function previous() {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setCurrentTitle(currentTitle - 1);
      setCurrentDescription(currentDescription - 1);
      setCurrentAuthorName(currentAuthorName - 1);
      setCurrentId(currentId - 1);
    } else {
      setCurrentSlide(thumbnails.length - 1);
      setCurrentTitle(name.length - 1);
      setCurrentDescription(desc.length - 1);
      setCurrentAuthorName(authorName.length - 1);
      setCurrentId(bookId.length - 1);
    }
  }

  function next() {
    if (currentSlide === thumbnails.length - 1) {
      setCurrentSlide(0);
      setCurrentDescription(0);
      setCurrentTitle(0);
      setCurrentAuthorName(0);
      setCurrentId(0);
    } else {
      setCurrentSlide(currentSlide + 1);
      setCurrentDescription(currentDescription + 1);
      setCurrentTitle(currentTitle + 1);
      setCurrentAuthorName(currentAuthorName + 1);
      setCurrentId(currentId + 1);
    }
  }
  useEffect(() => {
    const getAllBooks = async () => {
      if (!cookies.authorization) {
        navigate("/login");
        console.log(cookies.authorization);
      } else {
        const { data } = await axios.get("http://localhost:5000/api/books", {
          withCredentials: true,
        });

        let books = data.book;
        let images = data.book.map((elem: any) => [elem.image]);
        let descriptions = data.book.map((elem: any) => [elem.description]);
        let titles = data.book.map((elem: any) => [elem.title]);
        let ids = data.book.map((elem: any) => [elem._id]);
        let authors = data.book.map((elem: any) => [elem.author]);
        setBooks(books);
        setImage(images);
        setdescription(descriptions);
        setTitle(titles);
        setId(ids);
        setAuthor(authors);
      }
    };
    getAllBooks();
  }, [cookies, navigate, removeCookie]);

  const deleteBook = async () => {
    axios.delete("http://localhost:5000/api/books/" + bookId[currentId], {
      withCredentials: true,
    });
    window.location.reload();
  };
  return (
    <div>
      <section className="slideshow">
        <div className="slide-holder">
          <section className="slide previous-slide">
            <div style={previousSlideStyle} className="slide-thumbnail"></div>
          </section>
          <section className="slide current-slide">
            <div className="title">
              {name[currentTitle]} by {authorName[currentAuthorName]}
            </div>
            <div style={currentSlideStyle} className="slide-thumbnail"></div>
          </section>
          <section className="slide next-slide">
            <div style={nextSlideStyle} className="slide-thumbnail"></div>
          </section>
        </div>
        <div className="buttons">
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" color="inherit" onClick={handleClick}>
              Description
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={deleteBook}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Stack>
        </div>
        {isShown && (
          <div className="hidden-description">{desc[currentDescription]}</div>
        )}
        <div className="slideshow-controller">
          <Stack direction="row" spacing={160}>
            <Button
              style={{
                maxWidth: "120px",
                maxHeight: "50px",
                minWidth: "30px",
                minHeight: "30px",
              }}
              color="inherit"
              onClick={previous}
              variant="contained"
            >
              Previous
            </Button>
            <Button
              style={{
                maxWidth: "120px",
                maxHeight: "50px",
                minWidth: "120px",
                minHeight: "30px",
              }}
              color="inherit"
              onClick={next}
              variant="contained"
            >
              Next
            </Button>
          </Stack>
        </div>
      </section>
    </div>
  );
}
