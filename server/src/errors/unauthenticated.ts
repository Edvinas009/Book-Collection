import { StatusCodes } from "http-status-codes";

export class UnauthenticatedError extends Error {
  statusCode = StatusCodes.UNAUTHORIZED;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }
}
