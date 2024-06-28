import path from "node:path";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bookModel from "../models/bookModel";
import { deleteFileFromCloudinaryByUrl } from "../utils/deleteFileFromCloudinary";
import { AuthRequest } from "../middleware/authenticate";
import uploadOnCloudinary from "../utils/uploadFilesOnCloudinary";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre, description, price } = req.body;

    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };
        const coverImageMimeType = files.cover_image[0].mimetype
            .split("/")
            .at(-1);
        const fileName = files.cover_image[0].filename;
        const filePath = files.cover_image[0].path;

        const uploadResult = await uploadOnCloudinary(
            filePath,
            fileName,
            "book-covers",
            coverImageMimeType || "jpeg"
        );

        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/upload",
            bookFileName
        );
        const bookFileUploadResult = await uploadOnCloudinary(
            bookFilePath,
            bookFileName,
            "book-pdfs",
            "pdf"
        );
        const _req = req as AuthRequest;
        const newBook = await bookModel.create({
            title,
            description,
            genre,
            price,
            author: _req.userId,
            cover_image: uploadResult?.secure_url,
            file: bookFileUploadResult?.secure_url,
        });

        res.status(201).json({
            data: newBook,
            message: "Book registered Successfully .",
            status: 200,
        });
    } catch (err) {
        console.error(err);
        // return next(createHttpError(500, "Error while uploading the files."));
        const error = createHttpError(500, "Error while uploading the files.");
        return next(error);
    }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre, description, _id, price } = req.body;

    try {
        const book = await bookModel.findById({ _id: _id });

        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }

        const _req = req as AuthRequest;

        if (book.author.toString() !== _req.userId) {
            return next(
                createHttpError(
                    403,
                    "You are not authorized to update this book."
                )
            );
        }

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        let completeCoverImage = "";

        if (files?.cover_image) {
            const coverImageMimeType = files.cover_image[0].mimetype
                .split("/")
                .at(-1);
            const fileName = files.cover_image[0].filename;
            const filePath = files.cover_image[0].path;

            const uploadResult = await uploadOnCloudinary(
                filePath,
                fileName,
                "book-covers",
                coverImageMimeType || "jpeg"
            );
            if (uploadResult?.secure_url) {
                completeCoverImage = uploadResult?.secure_url;
            }

            if (book.cover_image) {
                const deleteFileResult = await deleteFileFromCloudinaryByUrl(
                    book.cover_image
                );

                if (deleteFileResult !== "ok") {
                    return next(
                        createHttpError(
                            403,
                            `Something went wrong while deleting cover image : ${deleteFileResult}`
                        )
                    );
                }
            }
        }

        let pdfFile = "";
        if (files?.file) {
            const bookFileName = files.file[0].filename;
            const bookFilePath = files.file[0].path;

            const bookFileUploadResult = await uploadOnCloudinary(
                bookFilePath,
                bookFileName,
                "book-pdfs",
                "pdf"
            );

            if (bookFileUploadResult?.secure_url) {
                pdfFile = bookFileUploadResult?.secure_url;
            }

            if (book.file) {
                const deleteFileResult = await deleteFileFromCloudinaryByUrl(
                    book.file
                );

                if (deleteFileResult !== "ok") {
                    return next(
                        createHttpError(
                            403,
                            `Something went wrong while deleting file  : ${deleteFileResult}`
                        )
                    );
                }
            }
        }

        const updatedBook = await bookModel.findOneAndUpdate(
            {
                _id: _id,
            },
            {
                title: title,
                description: description,
                genre: genre,
                price,
                cover_image: completeCoverImage
                    ? completeCoverImage
                    : book.cover_image,
                file: pdfFile ? pdfFile : book.file,
            },
            { new: true }
        );

        res.status(201).json({
            data: updatedBook,
            message: "Book updated Successfully .",
            status: 200,
        });
    } catch (err) {
        console.error(err);
        // return next(createHttpError(500, "Error while uploading the files."));
        const error = createHttpError(500, "Something went wrong.");
        return next(error);
    }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const book = await bookModel.findById({ _id: id });

        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }

        const _req = req as AuthRequest;

        if (book.author.toString() !== _req.userId) {
            return next(
                createHttpError(
                    403,
                    "You are not authorized to delete this book."
                )
            );
        }
        if (book?.file) {
            const deleteFileResult = await deleteFileFromCloudinaryByUrl(
                book.file
            );

            if (deleteFileResult !== "ok") {
                return next(
                    createHttpError(
                        403,
                        `Something went wrong while deleting file  : ${deleteFileResult}`
                    )
                );
            }
        }

        if (book?.cover_image) {
            const deleteFileResult = await deleteFileFromCloudinaryByUrl(
                book.cover_image
            );

            if (deleteFileResult !== "ok") {
                return next(
                    createHttpError(
                        403,
                        `Something went wrong while deleting cover image : ${deleteFileResult}`
                    )
                );
            }
        }

        const deletedBook = await bookModel.deleteOne({ _id: id });

        if (deletedBook?.acknowledged) {
            res.status(201).json({
                data: null,
                message: "Book deleted Successfully.",
                status: 200,
            });
        } else {
            res.status(500).json({
                data: null,
                message: "Something went wrong while deleting the book",
                status: 500,
            });
        }
    } catch (error) {
        console.error(error);
        return next(createHttpError(500, "Something went wrong."));
    }
};

const getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await bookModel.find().populate("author", "name");
        res.status(201).json({
            data: books,
            message: "Request for Books Successfully.",
            status: 200,
        });
    } catch (err) {
        return next(createHttpError(500, "Error while getting a books"));
    }
};
const getBook = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const book = await bookModel
            .findById({ _id: id })
            .populate("author", "name");

        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }
        res.status(201).json({
            data: book,
            message: "Request for Book Successfully.",
            status: 200,
        });
    } catch (err) {
        return next(createHttpError(500, "Error while getting a book"));
    }
};

export { createBook, updateBook, deleteBook, getBooks, getBook };
