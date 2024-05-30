import { Document } from "mongoose";
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    refreshToken?: string;
}

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    refreshToken?: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}
