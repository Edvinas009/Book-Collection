import React, { useState, useEffect, Component } from "react";
import TextField from "@mui/material/TextField";
import List from "../components/List";
import "./FindBook.css";

export default function FindBook() {
  const [inputText, setInputText] = useState("");

  let inputHandler = (e: React.FormEvent<EventTarget>): void => {
    var lowerCase = (e.target as HTMLInputElement).value.toLowerCase();
    setInputText(lowerCase);
  };

  return (
    <div className="main">
      <h1>Search for a book</h1>
      <div className="search">
        <TextField
          id="outlined-basic"
          onChange={inputHandler}
          variant="outlined"
          fullWidth
          label="Search"
        />
      </div>
      <List input={inputText} />
    </div>
  );
}
