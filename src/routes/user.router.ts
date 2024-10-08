import express from "express";
import {
    createUser,
    updateAccessToken,
    userLogin,
} from "../controllers/user.controller";

const userRouter = express.Router();

//routes

userRouter.post("/register", createUser);
userRouter.post("/login", userLogin);
userRouter.post("/updateAccesstoken", updateAccessToken);

export default userRouter;
