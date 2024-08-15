import { Schema, model } from "mongoose";
import { Purchases } from "../types/purchases.types";

const purchasesSchema = new Schema<Purchases>(
    {
        book_id: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const purchasesModel = model<Purchases>("Purchases", purchasesSchema);

export default purchasesModel;
