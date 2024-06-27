import { User } from "./userTypes";
import { Document } from "mongoose";

export interface Review extends Document {
    _id: string;
    user: User;
    rating: number;
    comment: string;
}
