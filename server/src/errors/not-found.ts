import { StatusCodes } from "http-status-codes";

export class NotFoundError extends Error {
  status = StatusCodes.NOT_FOUND;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
