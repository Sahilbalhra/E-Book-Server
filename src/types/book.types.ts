import { Review } from "./review.types";
import { User } from "./user.types";
import { Document } from "mongoose";

export interface Book extends Document {
    _id: string;
    title: string;
    description: string;
    author: User;
    genre: string;
    cover_image: string;
    price: number;
    file: string;
    reviews: Review[];
}
