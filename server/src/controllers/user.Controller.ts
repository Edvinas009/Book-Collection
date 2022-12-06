import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { handleErrors } from "../middleware/error-handler";
import { User } from "../models/user.model";
import { CustomRequest } from "../middleware/user.auth";
import { UnauthenticatedError } from "../errors/unauthenticated";
import { BadRequestError } from "../errors/bad-request";
import { NotFoundError } from "../errors/not-found";

//Did not finished to implement admin rights. 
//--------------------------------------------------------------------
export const createUser = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const nameAlreadyExists = await User.findOne({ title });
    if (nameAlreadyExists) {
      throw new BadRequestError("You already have this book");
    }
    const user = await User.create(req.body);
    if (!user) {
      throw new BadRequestError("Please enter smt");
    }
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Inserted successfully", user });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors, status: false });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await User.find({});
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors, status: false });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId });
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  const user = await User.findByIdAndUpdate({ _id: userId });
  if (!user) {
    throw new NotFoundError(`Book not found with this id: ${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`Book not found with this id: ${userId}`);
  }
  await user.remove();

  res.status(StatusCodes.OK).json({ msg: "Book removed successfully" });
};
