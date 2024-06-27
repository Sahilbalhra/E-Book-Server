import express from "express";
import authenticate from "../middleware/authenticate";
import { upload } from "../middleware/multer.middleware";
import {
    createBook,
    updateBook,
    deleteBook,
    getBooks,
    getBook,
} from "../controllers/bookController";

const bookRouter = express.Router();

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

bookRouter.patch(
    "/update",
    authenticate,
    upload.fields([
        { name: "cover_image", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    updateBook
);

bookRouter.delete("/:id", authenticate, deleteBook);
bookRouter.get("/:id", getBook);
bookRouter.get("/", getBooks);

export default bookRouter;
