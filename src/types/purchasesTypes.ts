import { Book } from "./bookTypes";
import { Document } from "mongoose";

export interface Purchases extends Document {
    _id: string;
    book_id: Book;
    amount: number;
    quantity: number;
}
