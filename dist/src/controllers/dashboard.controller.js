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
exports.getDashBoardData = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const review_model_1 = __importDefault(require("../models/review.model"));
const book_model_1 = __importDefault(require("../models/book.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const getDashBoardData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _req = req;
        if (_req.isAdmin) {
            const totalReviews = yield review_model_1.default.countDocuments();
            const totalBooks = yield book_model_1.default.countDocuments();
            // 3) Total number of users that added a review (distinct user_ids)
            const totalUsers = yield review_model_1.default.aggregate([
                {
                    $group: {
                        _id: "$user_id",
                    },
                },
            ]);
            // 4) Top 10 users who reviewed the most
            const topUsers = yield review_model_1.default.aggregate([
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
        }
        else {
            const objectId = _req.userId;
            const totalBooks = yield book_model_1.default
                .find({ author: objectId })
                .countDocuments();
            const totalReviews = yield book_model_1.default.aggregate([
                {
                    $match: { author: new mongoose_1.default.Types.ObjectId(objectId) },
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
            const totalUsers = yield book_model_1.default.aggregate([
                {
                    $match: { author: new mongoose_1.default.Types.ObjectId(objectId) },
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
            const topUsers = yield book_model_1.default.aggregate([
                {
                    $match: { author: new mongoose_1.default.Types.ObjectId(objectId) },
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
    }
    catch (err) {
        console.error(err);
        const error = (0, http_errors_1.default)(500, "Error getting data.");
        return next(error);
    }
});
exports.getDashBoardData = getDashBoardData;
