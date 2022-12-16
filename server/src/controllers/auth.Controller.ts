import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { handleErrors } from "../middleware/error-handler";
import { User } from "../models/user.model";
import { UnauthenticatedError } from "../errors/unauthenticated";
import { BadRequestError } from "../errors/bad-request";
const maxAge = 3 * 24 * 60 * 40;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Incorrect email");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthenticatedError("Password is not correct");
    }
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!
    );
    res.cookie("authorization", token, {
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(StatusCodes.OK).json({ user, token });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const emailAlreadyExists = await User.findOne({ email });

    if (emailAlreadyExists) {
      throw new BadRequestError("Email already taken");
    }
    const user = await User.create(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ msg: `${user} Created successfully` });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};
