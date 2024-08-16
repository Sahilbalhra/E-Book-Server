"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const purchasesSchema = new mongoose_1.Schema({
    book_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
const purchasesModel = (0, mongoose_1.model)("Purchases", purchasesSchema);
exports.default = purchasesModel;
