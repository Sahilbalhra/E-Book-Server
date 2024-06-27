import { Document } from "mongoose";
import { User } from "./userTypes";
import { Purchases } from "./purchasesTypes";

export interface Order extends Document {
    _id: string;
    user: User;
    total_amount: number;
    status: string;
    items: Purchases[];
}
