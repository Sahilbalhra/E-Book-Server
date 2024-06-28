import { Schema, model } from "mongoose";
import { Review } from "../types/reviewTypes";

const reviewSchema = new Schema<Review>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        book_id: {
            type: Schema.Types.ObjectId,
            ref: "Book",
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
    },
    { timestamps: true }
);

const reviewModel = model<Review>("Review", reviewSchema);

export default reviewModel;
