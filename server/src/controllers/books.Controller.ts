import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import path from "path";
import { handleErrors } from "../middleware/error-handler";
import { Book } from "../models/book.model";
import { BadRequestError } from "../errors/bad-request";
import { NotFoundError } from "../errors/not-found";
import JwtPayload from "../models/JwtPayload";

export const createBook = async (req: Request, res: Response) => {
  const authHeader = req.cookies.authorization;
  try {
    const { title, image, author, pageCount, description } = req.body;

    const { id } = jwt.verify(
      authHeader,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const userId = id;
    const nameAlreadyExists = await Book.findOne({ title, userId });
    if (nameAlreadyExists) {
      throw new BadRequestError("You already have this book");
    }
    if (!title || !author || !pageCount || !description) {
      throw new BadRequestError("Please provide valid information");
    }
    const book = await Book.create({
      title,
      image,
      author,
      pageCount,
      description,
      userId,
    });

    if (!book) {
      throw new BadRequestError("Information is missing");
    }

    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Inserted successfully", book });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors, status: false });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  const authHeader = req.cookies.authorization;
  try {
    const { id } = jwt.verify(
      authHeader,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const book = await Book.find({ userId: id });

    res.status(StatusCodes.OK).json({ book });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors, status: false });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const { id: bookId } = req.params;
    const book = await Book.findOne({ _id: bookId });
    res.status(StatusCodes.OK).json({ book });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors, status: false });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id: bookId } = req.params;

    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      throw new NotFoundError(`Book not found with this id: ${bookId}`);
    }
    await book.remove();

    res.send("Book removed successfully");
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors, status: false });
  }
};

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    if (!(req as any).files) {
      throw new BadRequestError("No File Uploaded");
    }
    const bookImage = (req as any).files.file;

    if (!bookImage.mimetype.startsWith("image")) {
      throw new BadRequestError("Please Upload Image");
    }

    const maxSize = 1024 * 1024;

    if (bookImage.size > maxSize) {
      throw new BadRequestError("Please upload image smaller than 1MB");
    }

    const imagePath = path.join(
      __dirname,
      "../public/img/" + `${bookImage.name}`
    );
    await bookImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/img/${bookImage.name}` });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors, status: false });
  }
};
