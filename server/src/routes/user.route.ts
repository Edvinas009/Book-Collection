import express, { Router, Request, Response } from "express";
const router = express.Router();
import * as userController from "../controllers/user.Controller";
import * as verify from "../utils/jwt";
import { auth } from "../middleware/user.auth";
//Did not finished to implement admin rights. 
//--------------------------------------------------------------------
router.patch("/:id", verify.verifyUser, userController.updateUser);
router.delete("/:id", verify.verifyUser, userController.deleteUser);
router.get("/:id", verify.verifyUser, userController.getUser);
router.get("/", verify.verifyAdmin, userController.getAllUsers);

export default router;
