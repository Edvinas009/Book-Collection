import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError } from "../errors/unauthenticated";
import { handleErrors } from "../middleware/error-handler";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.cookies.authorization;
  try {
    if (authHeader) {
      jwt.verify(
        authHeader,
        process.env.JWT_SECRET!,
        async (err: any, decodedToken: any) => {
          const user = await User.findById(decodedToken.id);
          if (user) {
            next();
          } else throw new UnauthenticatedError("No token provided");
        }
      );
    } else {
      res.json({ status: false });
      next();
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors, status: false });
  }
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authorization;
  try {
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET!,
        async (err: any, decodedToken: any) => {
          const user = await User.findById(decodedToken.id);
          if (user?.isAdmin) next();
          else throw new UnauthenticatedError("No token provided");
        }
      );
    } else {
      res.json({ status: false });
      next();
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors, status: false });
  }
};
