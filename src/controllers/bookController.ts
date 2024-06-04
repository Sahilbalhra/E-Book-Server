import path from "node:path";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bookModel from "../models/bookModel";
import { AuthRequest } from "../middleware/authenticate";
import uploadOnCloudinary from "../utils/uploadFilesOnCloudinary";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    // 'application/pdf'
    const coverImageMimeType = files.cover_image[0].mimetype.split("/").at(-1);
    const fileName = files.cover_image[0].filename;
    const filePath = path.resolve(
        __dirname,
        "../../public/data/upload",
        fileName
    );

    console.log("coverImageMimeType", coverImageMimeType);
    console.log("fileName", fileName);
    console.log("filePath", filePath);

    try {
        // const uploadResult = await cloudinary.uploader.upload(filePath, {
        //     resource_type: "auto",
        //     filename_override: fileName,
        //     folder: "book-covers",
        //     format: coverImageMimeType,
        // });
        const uploadResult = await uploadOnCloudinary(
            filePath,
            fileName,
            "book-covers",
            coverImageMimeType || "jpeg"
        );
        console.log("uploadResult", uploadResult);

        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/upload",
            bookFileName
        );

        console.log("bookFileName", bookFileName);
        console.log("bookFilePath", bookFilePath);

        // const bookFileUploadResult = await cloudinary.uploader.upload(
        //     bookFilePath,
        //     {
        //         resource_type: "raw",
        //         filename_override: bookFileName,
        //         folder: "book-pdfs",
        //         format: "pdf",
        //     }
        // );
        const bookFileUploadResult = await uploadOnCloudinary(
            bookFilePath,
            bookFileName,
            "book-pdfs",
            "pdf"
        );

        console.log("bookFileUploadResult", bookFileUploadResult);
        const _req = req as AuthRequest;
        // console.log("req", _req);
        const newBook = await bookModel.create({
            title,
            description,
            genre,
            author: _req.userId,
            cover_image: uploadResult?.secure_url,
            file: bookFileUploadResult?.secure_url,
        });

        res.status(201).json({ id: newBook._id });
    } catch (err) {
        console.log(err);
        // return next(createHttpError(500, "Error while uploading the files."));
        const error = createHttpError(500, "Error while uploading the files.");
        return next(error);
    }
};

export { createBook };
