import express, { Router, Request, Response } from "express";
const router = express.Router();
import * as userController from "../controllers/auth.Controller";

router.post("/login", userController.login);
router.post("/register", userController.register);

export default router;
