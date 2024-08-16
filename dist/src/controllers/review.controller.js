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
exports.deleteReviewById = exports.getReviewByBookId = exports.addReview = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
const user_model_1 = __importDefault(require("../models/user.model"));
const book_model_1 = __importDefault(require("../models/book.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
const addReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, comment, title } = req.body;
    const { book_id } = req.params;
    try {
        const _req = req;
        const user_id = _req.userId;
        if (!user_id) {
            return next((0, http_errors_1.default)(401, "User not authenticated"));
        }
        const user = yield user_model_1.default.findById(user_id);
        if (!user) {
            return next((0, http_errors_1.default)(401, "User not found!"));
        }
        const book = yield book_model_1.default.findById(book_id);
        if (!book) {
            return next((0, http_errors_1.default)(401, "Book not found!"));
        }
        const review = yield review_model_1.default.create({
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
    }
    catch (err) {
        console.error(err);
        // return next(createHttpError(500, "Error while uploading the files."));
        const error = (0, http_errors_1.default)(500, "Error while Adding the Review.");
        return next(error);
    }
});
exports.addReview = addReview;
const getReviewByBookId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book_id } = req.params;
        if (!book_id) {
            return next((0, http_errors_1.default)(400, "Book ID is required"));
        }
        const reviews = yield review_model_1.default
            .find({ book_id })
            .populate("user_id", "name email");
        const objectId = new mongoose_1.default.Types.ObjectId(book_id);
        const reviewsData = yield review_model_1.default.aggregate([
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
        const ratings = [];
        reviewsData.forEach(({ _id, count, totalSum: sum }) => {
            ratings.push({
                rating: _id,
                count: count,
            });
            totalRatings += count;
            totalSum += sum;
        });
        const averageRating = Number(Number(totalRatings > 0 ? totalSum / totalRatings : 0).toFixed(2));
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
    }
    catch (err) {
        console.error(err);
        // return next(createHttpError(500, "Error while uploading the files."));
        const error = (0, http_errors_1.default)(500, "Error while getting the Review.");
        return next(error);
    }
});
exports.getReviewByBookId = getReviewByBookId;
const deleteReviewById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { review_id } = req.params;
    try {
        const deletedReview = yield review_model_1.default.findByIdAndDelete(review_id);
        if (!deletedReview) {
            return next((0, http_errors_1.default)(404, "Review not found"));
        }
        res.status(200).json({
            status: 200,
            message: "Review deleted successfully",
        });
    }
    catch (err) {
        console.error(err);
        const error = (0, http_errors_1.default)(500, "Error while deleting the Review.");
        return next(error);
    }
});
exports.deleteReviewById = deleteReviewById;
