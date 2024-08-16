"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBook = exports.getBooks = exports.deleteBook = exports.updateBook = exports.createBook = void 0;
const node_path_1 = __importDefault(require("node:path"));
const http_errors_1 = __importDefault(require("http-errors"));
const book_model_1 = __importDefault(require("../models/book.model"));
const deleteFileFromCloudinary_1 = require("../utils/deleteFileFromCloudinary");
const uploadFilesOnCloudinary_1 = __importDefault(require("../utils/uploadFilesOnCloudinary"));
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, genre, description, price } = req.body;
    try {
        const files = req.files;
        const coverImageMimeType = files.cover_image[0].mimetype
            .split("/")
            .at(-1);
        const fileName = files.cover_image[0].filename;
        const filePath = files.cover_image[0].path;
        const uploadResult = yield (0, uploadFilesOnCloudinary_1.default)(filePath, fileName, "book-covers", coverImageMimeType || "jpeg");
        const bookFileName = files.file[0].filename;
        const bookFilePath = node_path_1.default.resolve(__dirname, "../../public/data/upload", bookFileName);
        const bookFileUploadResult = yield (0, uploadFilesOnCloudinary_1.default)(bookFilePath, bookFileName, "book-pdfs", "pdf");
        const _req = req;
        const newBook = yield book_model_1.default.create({
            title,
            description,
            genre,
            price,
            author: _req.userId,
            cover_image: uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url,
            file: bookFileUploadResult === null || bookFileUploadResult === void 0 ? void 0 : bookFileUploadResult.secure_url,
        });
        res.status(201).json({
            data: newBook,
            message: "Book registered Successfully .",
            status: 200,
        });
    }
    catch (err) {
        console.error(err);
        // return next(createHttpError(500, "Error while uploading the files."));
        const error = (0, http_errors_1.default)(500, "Error while uploading the files.");
        return next(error);
    }
});
exports.createBook = createBook;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, genre, description, _id, price } = req.body;
    try {
        const book = yield book_model_1.default.findById({ _id: _id });
        if (!book) {
            return next((0, http_errors_1.default)(404, "Book not found"));
        }
        const _req = req;
        if (book.author.toString() !== _req.userId) {
            return next((0, http_errors_1.default)(403, "You are not authorized to update this book."));
        }
        const files = req.files;
        let completeCoverImage = "";
        if (files === null || files === void 0 ? void 0 : files.cover_image) {
            const coverImageMimeType = files.cover_image[0].mimetype
                .split("/")
                .at(-1);
            const fileName = files.cover_image[0].filename;
            const filePath = files.cover_image[0].path;
            const uploadResult = yield (0, uploadFilesOnCloudinary_1.default)(filePath, fileName, "book-covers", coverImageMimeType || "jpeg");
            if (uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url) {
                completeCoverImage = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
            }
            if (book.cover_image) {
                const deleteFileResult = yield (0, deleteFileFromCloudinary_1.deleteFileFromCloudinaryByUrl)(book.cover_image);
                if (deleteFileResult !== "ok") {
                    return next((0, http_errors_1.default)(403, `Something went wrong while deleting cover image : ${deleteFileResult}`));
                }
            }
        }
        let pdfFile = "";
        if (files === null || files === void 0 ? void 0 : files.file) {
            const bookFileName = files.file[0].filename;
            const bookFilePath = files.file[0].path;
            const bookFileUploadResult = yield (0, uploadFilesOnCloudinary_1.default)(bookFilePath, bookFileName, "book-pdfs", "pdf");
            if (bookFileUploadResult === null || bookFileUploadResult === void 0 ? void 0 : bookFileUploadResult.secure_url) {
                pdfFile = bookFileUploadResult === null || bookFileUploadResult === void 0 ? void 0 : bookFileUploadResult.secure_url;
            }
            if (book.file) {
                const deleteFileResult = yield (0, deleteFileFromCloudinary_1.deleteFileFromCloudinaryByUrl)(book.file);
                if (deleteFileResult !== "ok") {
                    return next((0, http_errors_1.default)(403, `Something went wrong while deleting file  : ${deleteFileResult}`));
                }
            }
        }
        const updatedBook = yield book_model_1.default.findOneAndUpdate({
            _id: _id,
        }, {
            title: title,
            description: description,
            genre: genre,
            price,
            cover_image: completeCoverImage
                ? completeCoverImage
                : book.cover_image,
            file: pdfFile ? pdfFile : book.file,
        }, { new: true });
        res.status(201).json({
            data: updatedBook,
            message: "Book updated Successfully .",
            status: 200,
        });
    }
    catch (err) {
        console.error(err);
        // return next(createHttpError(500, "Error while uploading the files."));
        const error = (0, http_errors_1.default)(500, "Something went wrong.");
        return next(error);
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const book = yield book_model_1.default.findById({ _id: id });
        if (!book) {
            return next((0, http_errors_1.default)(404, "Book not found"));
        }
        const _req = req;
        if (book.author.toString() !== _req.userId) {
            return next((0, http_errors_1.default)(403, "You are not authorized to delete this book."));
        }
        if (book === null || book === void 0 ? void 0 : book.file) {
            const deleteFileResult = yield (0, deleteFileFromCloudinary_1.deleteFileFromCloudinaryByUrl)(book.file);
            if (deleteFileResult !== "ok") {
                return next((0, http_errors_1.default)(403, `Something went wrong while deleting file  : ${deleteFileResult}`));
            }
        }
        if (book === null || book === void 0 ? void 0 : book.cover_image) {
            const deleteFileResult = yield (0, deleteFileFromCloudinary_1.deleteFileFromCloudinaryByUrl)(book.cover_image);
            if (deleteFileResult !== "ok") {
                return next((0, http_errors_1.default)(403, `Something went wrong while deleting cover image : ${deleteFileResult}`));
            }
        }
        const deletedBook = yield book_model_1.default.deleteOne({ _id: id });
        if (deletedBook === null || deletedBook === void 0 ? void 0 : deletedBook.acknowledged) {
            res.status(201).json({
                data: null,
                message: "Book deleted Successfully.",
                status: 200,
            });
        }
        else {
            res.status(500).json({
                data: null,
                message: "Something went wrong while deleting the book",
                status: 500,
            });
        }
    }
    catch (error) {
        console.error(error);
        return next((0, http_errors_1.default)(500, "Something went wrong."));
    }
});
exports.deleteBook = deleteBook;
const getBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield book_model_1.default.find().populate("author", "name");
        res.status(201).json({
            data: books,
            message: "Request for Books Successfully.",
            status: 200,
        });
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Error while getting a books"));
    }
});
exports.getBooks = getBooks;
const getBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const book = yield book_model_1.default
            .findById({ _id: id })
            .populate("author", "name");
        if (!book) {
            return next((0, http_errors_1.default)(404, "Book not found"));
        }
        res.status(201).json({
            data: book,
            message: "Request for Book Successfully.",
            status: 200,
        });
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Error while getting a book"));
    }
});
exports.getBook = getBook;
