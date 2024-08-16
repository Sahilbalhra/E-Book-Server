"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const multer_middleware_1 = require("../middleware/multer.middleware");
const book_controller_1 = require("../controllers/book.controller");
const bookRouter = express_1.default.Router();
//routes
bookRouter.post("/create", authenticate_1.default, multer_middleware_1.upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), book_controller_1.createBook);
bookRouter.patch("/update", authenticate_1.default, multer_middleware_1.upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), book_controller_1.updateBook);
bookRouter.delete("/:id", authenticate_1.default, book_controller_1.deleteBook);
bookRouter.get("/:id", authenticate_1.default, book_controller_1.getBook);
bookRouter.get("/", authenticate_1.default, book_controller_1.getBooks);
exports.default = bookRouter;
