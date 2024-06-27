import { Schema, model } from "mongoose";
import { Purchases } from "../types/purchasesTypes";

const purchasesSchema = new Schema<Purchases>(
    {
        book_id: {
            type: String,
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
