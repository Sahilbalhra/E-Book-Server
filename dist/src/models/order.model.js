"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Purchases",
        required: true,
    },
}, { timestamps: true });
const orderModel = (0, mongoose_1.model)("Order", orderSchema);
exports.default = orderModel;
