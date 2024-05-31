import express from "express";
import path from "node:path";
import multer from "multer";
import { createUser, userLogin } from "../controllers/userController";

const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/upload"),
    limits: { fileSize: 3e7 },
});

//routes

bookRouter.post(
    "/create",
    upload.fields([
        { name: "cover_image", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    createUser
);
bookRouter.post("/update", userLogin);
bookRouter.get("/get", userLogin);

export default bookRouter;
