import { Schema, model } from "mongoose";
import { Order } from "../types/order.types";

const orderSchema = new Schema<Order>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        total_amount: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            required: true,
        },
        items: {
            type: [Schema.Types.ObjectId],
            ref: "Purchases",
            required: true,
        },
    },
    { timestamps: true }
);

const orderModel = model<Order>("Order", orderSchema);

export default orderModel;
