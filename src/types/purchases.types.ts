import { Book } from "./book.types";
import { Document } from "mongoose";
import { User } from "./user.types";

export interface Purchases extends Document {
    _id: string;
    book_id: Book;
    user_id: User;
    amount: number;
    quantity: number;
}
