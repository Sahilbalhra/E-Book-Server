import { Schema, model } from "mongoose";
import { Book } from "../types/book.types";

const bookSchema = new Schema<Book>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cover_image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
            required: false,
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
    },
    { timestamps: true }
);

const bookModel = model<Book>("Book", bookSchema);

export default bookModel;
