import { Schema, model } from "mongoose";
import { Book } from "../types/bookTypes";

const bookSchema = new Schema<Book>(
    {
        title: {
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
        file: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const bookModel = model<Book>("Book", bookSchema);

export default bookModel;