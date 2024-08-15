import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authenticate";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import userModel from "../models/user.model";
import bookModel from "../models/book.model";
import reviewModel from "../models/review.model";

interface ReviewData {
    _id: number;
    count: number;
    totalSum: number;
}

const addReview = async (req: Request, res: Response, next: NextFunction) => {
    const { rating, comment, title } = req.body;
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
            title: title,
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

        const objectId = new mongoose.Types.ObjectId(book_id);

        const reviewsData: ReviewData[] = await reviewModel.aggregate([
            { $match: { book_id: objectId } },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 },
                    totalSum: { $sum: "$rating" },
                },
            },
            { $sort: { _id: -1 } },
        ]);

        let totalRatings = 0;
        let totalSum = 0;

        const ratings: {
            rating: number;
            count: number;
        }[] = [];

        reviewsData.forEach(({ _id, count, totalSum: sum }) => {
            ratings.push({
                rating: _id,
                count: count,
            });
            totalRatings += count;
            totalSum += sum;
        });

        const averageRating = Number(
            Number(totalRatings > 0 ? totalSum / totalRatings : 0).toFixed(2)
        );

        res.status(200).json({
            status: 200,
            data: {
                reviews: reviews,
                ratings: ratings,
                totalRatings: totalRatings,
                averageRating: averageRating,
            },
            message: "Request Success Successfully .",
        });
    } catch (err) {
        console.error(err);
        // return next(createHttpError(500, "Error while uploading the files."));
        const error = createHttpError(500, "Error while getting the Review.");
        return next(error);
    }
};

const deleteReviewById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { review_id } = req.params;
    try {
        const deletedReview = await reviewModel.findByIdAndDelete(review_id);

        if (!deletedReview) {
            return next(createHttpError(404, "Review not found"));
        }

        res.status(200).json({
            status: 200,
            message: "Review deleted successfully",
        });
    } catch (err) {
        console.error(err);
        const error = createHttpError(500, "Error while deleting the Review.");
        return next(error);
    }
};

export { addReview, getReviewByBookId, deleteReviewById };
