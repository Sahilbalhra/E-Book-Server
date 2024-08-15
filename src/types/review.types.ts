import { Book } from "./book.types";
import { User } from "./user.types";
import { Document } from "mongoose";

export interface Review extends Document {
    _id: string;
    title: string;
    user_id: User;
    book_id: Book;
    rating: number;
    comment: string;
}
