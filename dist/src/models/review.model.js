"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    book_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const reviewModel = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = reviewModel;
