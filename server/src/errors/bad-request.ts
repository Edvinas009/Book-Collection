import { StatusCodes } from "http-status-codes";

export class BadRequestError extends Error {
  status = StatusCodes.BAD_REQUEST;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
