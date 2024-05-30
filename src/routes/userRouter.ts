import express from "express";
import { createUser, userLogin } from "../controllers/userController";

const userRouter = express.Router();

//routes

userRouter.post("/register", createUser);
userRouter.post("/login", userLogin);

export default userRouter;
