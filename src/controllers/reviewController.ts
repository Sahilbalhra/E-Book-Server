import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authenticate";
import createHttpError from "http-errors";
import userModel from "../models/userModel";
import bookModel from "../models/bookModel";
import reviewModel from "../models/reviewModel";

const addReview = async (req: Request, res: Response, next: NextFunction) => {
    const { rating, comment } = req.body;

    const { book_id } = req.params;

    try {
        const _req = req as AuthRequest;
        const user_id = _req.userId;

        if (!user_id) {
            return next(createHttpError(401, "User not authenticated"));
        }

        const user = await userModel.findById(user_id);

        if (!user) {
            return next(createHttpError(401, "User not found!"));
        }

        const book = await bookModel.findById(book_id);

        if (!book) {
            return next(createHttpError(401, "Book not found!"));
        }

        const review = await reviewModel.create({
            user_id: user_id,
            book_id: book_id,
            rating: rating,
            comment: comment,
        });

        res.status(201).json({
            data: review,
            message: "Review Added Successfully .",
            status: 200,
        });
    } catch (err) {
        console.error(err);
        // return next(createHttpError(500, "Error while uploading the files."));
        const error = createHttpError(500, "Error while Adding the Review.");
        return next(error);
    }
};

const getReviewByBookId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { book_id } = req.params;

        if (!book_id) {
            return next(createHttpError(400, "Book ID is required"));
        }

        const reviews = await reviewModel
            .find({ book_id })
            .populate("user_id", "name email");

        res.status(200).json({
            status: 200,
            data: reviews,
            message: "Request Success Successfully .",
        });
    } catch (err) {
        console.error(err);
        // return next(createHttpError(500, "Error while uploading the files."));
        const error = createHttpError(500, "Error while getting the Review.");
        return next(error);
    }
};

export { addReview, getReviewByBookId };
