"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cover_image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    file: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    // reviews: {
    //     type: [Schema.Types.ObjectId],
    //     ref: "Review",
    //     default: [],
    // },
}, { timestamps: true });
const bookModel = (0, mongoose_1.model)("Book", bookSchema);
exports.default = bookModel;
