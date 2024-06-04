import express from "express";
import path from "node:path";
import multer from "multer";
import authenticate from "../middleware/authenticate";
import { createBook } from "../controllers/bookController";

const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/upload"),
    limits: { fileSize: 3e7 },
});

//routes

bookRouter.post(
    "/create",
    authenticate,
    upload.fields([
        { name: "cover_image", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    createBook
);

export default bookRouter;
