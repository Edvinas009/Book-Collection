import express, { Router, Request, Response } from "express";
const router = express.Router();
import * as bookController from "../controllers/books.Controller";
import * as verify from "../utils/jwt";

router
  .route("/")
  .post(verify.verifyUser, bookController.createBook)
  .get(verify.verifyUser, bookController.getAllBooks);

router.post("/uploadImage", verify.verifyUser, bookController.uploadImage);
router.get("/find/:id", verify.verifyUser, bookController.getBook);

router.route("/:id").delete(verify.verifyUser, bookController.deleteBook);

export default router;
