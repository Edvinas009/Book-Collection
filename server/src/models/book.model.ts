import mongoose from "mongoose";

export interface BookInterface extends mongoose.Document {
  title: string;
  pageCount?: number;
  description?: string;
  image: string;
  author: string;
  userId: string;
}

const BookSchema: mongoose.Schema<BookInterface> = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide title"],
    default: "Title is missing",
    maxlength: [50, "Title can not be more than 20 characters"],
  },
  image: {
    type: String,
    // required: [true, "Please provide image"],
    default: "http://localhost:5000/img/book_noun_001_01679.png",
  },
  pageCount: {
    type: Number,
  },
  userId: {
    type: String,
  },
  description: {
    type: String,
    maxlength: [1000, "Description can not be more than 1000 characters"],
  },
  author: {
    type: String,
    required: [true, "Please provide author"],
  },
});

export const Book = mongoose.model<BookInterface>("Book", BookSchema);
