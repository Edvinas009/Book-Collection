import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function List(props: any) {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [cookies, removeCookie] = useCookies<string>([]);

  useEffect(() => {
    const getAllBooks = async () => {
      if (!cookies.authorization) {
        // navigate("/login");
        console.log(cookies.authorization);
      } else {
        const { data } = await axios.get("http://localhost:5000/api/books", {
          withCredentials: true,
        });
        let book = data.book.map((elem: any) => [elem.title, elem._id]);

        setBooks(book);
      }
    };
    getAllBooks();
  }, [cookies, navigate, removeCookie]);

  //create a new array by filtering the original array
  const filteredData = books.filter((elem: string) => {
    //if no input the return the original
    if (props.input === "") {
      return elem;
    }
    //return the item which contains the user input
    else {
      return elem.toString().toLowerCase().includes(props.input);
    }
  });
  return (
    <ul>
      {filteredData.map((item: string) => (
        <li key={item}>{item[0]}</li>
      ))}
    </ul>
  );
}
