import { Document } from "mongoose";
import { User } from "./user.types";
import { Purchases } from "./purchases.types";

export interface Order extends Document {
    _id: string;
    user: User;
    total_amount: number;
    status: string;
    items: Purchases[];
}
