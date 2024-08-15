import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import reviewModel from "../models/review.model";
import bookModel from "../models/book.model";
import mongoose from "mongoose";

const getDashBoardData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const _req = req as AuthRequest;
        if (_req.isAdmin) {
            const totalReviews = await reviewModel.countDocuments();

            const totalBooks = await bookModel.countDocuments();

            // 3) Total number of users that added a review (distinct user_ids)
            const totalUsers = await reviewModel.aggregate([
                {
                    $group: {
                        _id: "$user_id",
                    },
                },
            ]);

            // 4) Top 10 users who reviewed the most
            const topUsers = await reviewModel.aggregate([
                {
                    $group: {
                        _id: "$user_id",
                        reviewCount: { $sum: 1 },
                    },
                },
                {
                    $sort: { reviewCount: -1 },
                },
                {
                    $limit: 10,
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
                },
                {
                    $project: {
                        _id: 0,
                        user_id: "$_id",
                        name: "$user.name",
                        email: "$user.email",
                        reviewCount: 1,
                    },
                },
            ]);

            res.json({
                status: 200,
                data: {
                    totalReviews,
                    totalBooks,
                    totalUsers: totalUsers.length,
                    topUsers,
                },
                message: "Request Successfully .",
            });
        } else {
            const objectId = _req.userId;

            const totalBooks = await bookModel
                .find({ author: objectId })
                .countDocuments();

            const totalReviews = await bookModel.aggregate([
                {
                    $match: { author: new mongoose.Types.ObjectId(objectId) },
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "book_id",
                        as: "review",
                    },
                },
                {
                    $unwind: "$review",
                },
                {
                    $project: {
                        _id: "$review._id",
                        user_id: "$review.user_id",
                        title: "$review.title",
                        rating: "$review.rating",
                        comment: "$review.comment",
                    },
                },
            ]);

            // 3) Total number of users that added a review (distinct user_ids)
            const totalUsers = await bookModel.aggregate([
                {
                    $match: { author: new mongoose.Types.ObjectId(objectId) },
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "book_id",
                        as: "review",
                    },
                },
                {
                    $unwind: "$review",
                },
                {
                    $project: {
                        _id: "$review._id",
                        user_id: "$review.user_id",
                        title: "$review.title",
                        rating: "$review.rating",
                        comment: "$review.comment",
                    },
                },
                {
                    $group: {
                        _id: "$user_id",
                        reviewCount: { $sum: 1 },
                    },
                },
            ]);

            // 4) Top 10 users who reviewed the most
            const topUsers = await bookModel.aggregate([
                {
                    $match: { author: new mongoose.Types.ObjectId(objectId) },
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "book_id",
                        as: "review",
                    },
                },
                {
                    $unwind: "$review",
                },
                {
                    $project: {
                        _id: "$review._id",
                        user_id: "$review.user_id",
                        title: "$review.title",
                        rating: "$review.rating",
                        comment: "$review.comment",
                    },
                },
                {
                    $group: {
                        _id: "$user_id",
                        reviewCount: { $sum: 1 },
                    },
                },
                {
                    $sort: { reviewCount: -1 },
                },
                {
                    $limit: 10,
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
                },
                {
                    $project: {
                        _id: 0,
                        user_id: "$_id",
                        name: "$user.name",
                        email: "$user.email",
                        reviewCount: 1,
                    },
                },
            ]);

            res.json({
                status: 200,
                data: {
                    totalReviews: totalReviews.length,
                    totalBooks,
                    totalUsers: totalUsers.length,
                    topUsers,
                },
                message: "Request Successfully .",
            });
        }
    } catch (err) {
        console.error(err);
        const error = createHttpError(500, "Error getting data.");
        return next(error);
    }
};

export { getDashBoardData };
