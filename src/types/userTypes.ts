import { Document } from "mongoose";
import { Purchases } from "./purchasesTypes";
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    refreshToken?: string;
    role: string;
    purchases: Purchases[];
}

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    purchases: Purchases[];
    refreshToken?: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}
