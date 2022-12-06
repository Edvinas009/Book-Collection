import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError } from "../errors/unauthenticated";
import { handleErrors } from "../middleware/error-handler";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    // const authHeader = req.cookies.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthenticatedError("No token provided");
    }
    console.log(authHeader);

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
