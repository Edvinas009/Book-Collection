import connectDB from "./db/connect";
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import bookRouter from "./routes/book.route";
import userRouter from "./routes/user.route";
import { notFoundMiddleware } from "./middleware/not-found";
import fileUpload from "express-fileupload";
// import rateLimiter from "express-rate-limit";
// import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";
const app = express();
dotenv.config();

//Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use("/img", express.static("src/public/img"));
app.use(fileUpload());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
