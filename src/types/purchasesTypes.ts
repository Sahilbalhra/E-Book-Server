import { Book } from "./bookTypes";
import { Document } from "mongoose";
import { User } from "./userTypes";

export interface Purchases extends Document {
    _id: string;
    book_id: Book;
    user_id: User;
    amount: number;
    quantity: number;
}
