import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { handleErrors } from "../middleware/error-handler";
import { User } from "../models/user.model";
import { BadRequestError } from "../errors/bad-request";
import { NotFoundError } from "../errors/not-found";
import JwtPayload from "../models/JwtPayload";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const nameAlreadyExists = await User.findOne({ email });
    if (nameAlreadyExists) {
      throw new BadRequestError("User already exist");
    }
    const user = await User.create(req.body);
    if (!user) {
      throw new BadRequestError("Please enter information");
    }
    res.status(StatusCodes.CREATED).json({ msg: "Created successfully", user });
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

export const getCurrentUser = async (req: Request, res: Response) => {
  const authHeader = req.cookies.authorization;
  try {
    const { id } = jwt.verify(
      authHeader,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const user = await User.findById(id);
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

  const user = await User.findByIdAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(user);

  if (!user) {
    throw new NotFoundError(`User not found with this id: ${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`User not found with this id: ${userId}`);
  }
  await user.remove();

  res.status(StatusCodes.OK).json({ msg: "User removed successfully" });
};
