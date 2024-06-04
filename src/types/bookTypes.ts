import { User } from "./userTypes";
import { Document } from "mongoose";

export interface Book extends Document {
    _id: string;
    title: string;
    description: string;
    author: User;
    genre: string;
    cover_image: string;
    file: string;
}
