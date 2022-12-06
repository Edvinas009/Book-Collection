import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError } from "../errors/unauthenticated";
import { handleErrors } from "../middleware/error-handler";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const authHeader = req.cookies.authorization;
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthenticatedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    (req as CustomRequest).token = decoded;
    console.log((req as CustomRequest).token);

    next();
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors, status: false });
  }
};

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.cookies.authorization;

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
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const token = req.cookies.authorization;
  const token = req.headers.authorization;
  console.log(token);

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
};
