import { Book } from "./bookTypes";
import { User } from "./userTypes";
import { Document } from "mongoose";

export interface Review extends Document {
    _id: string;
    user_id: User;
    book_id: Book;
    rating: number;
    comment: string;
}
