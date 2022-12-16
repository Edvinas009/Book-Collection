import express, { Router, Request, Response } from "express";
const router = express.Router();
import * as userController from "../controllers/user.Controller";
import * as verify from "../utils/jwt";

router
  .route("/findUser/:id")
  .delete(verify.verifyAdmin, userController.deleteUser)
  .patch(verify.verifyUser, userController.updateUser)
  .get(verify.verifyAdmin, userController.getUser);
router
  .route("/currentUser")
  .get(verify.verifyUser, userController.getCurrentUser);
router
  .route("/")
  .get(verify.verifyAdmin, userController.getAllUsers)
  .post(verify.verifyAdmin, userController.createUser);
export default router;
