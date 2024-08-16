"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByUserId = exports.createOrder = void 0;
const purchases_model_1 = __importDefault(require("../models/purchases.model"));
const book_model_1 = __importDefault(require("../models/book.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const http_errors_1 = __importDefault(require("http-errors"));
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { book_id, amount, quantity } = req.body;
    if (!book_id) {
        return next((0, http_errors_1.default)(401, "Book Id is required !"));
    }
    try {
        const _req = req;
        const user_id = _req.userId;
        if (!user_id) {
            return next((0, http_errors_1.default)(401, "User not authenticated"));
        }
        const user = yield user_model_1.default.findById(user_id);
        if (!user) {
            return next((0, http_errors_1.default)(401, "User not found!"));
        }
        const book = yield book_model_1.default.findById(book_id);
        if (!book) {
            return next((0, http_errors_1.default)(401, "Book not found!"));
        }
        const order = yield purchases_model_1.default.create({
            user_id: user_id,
            book_id: book_id,
            amount,
            quantity,
        });
        res.status(201).json({
            data: order,
            message: "Order Created Successfully .",
            status: 200,
        });
    }
    catch (err) {
        console.error(err);
        const error = (0, http_errors_1.default)(500, "Something Went Wrong While Create Order .");
        return next(error);
    }
});
exports.createOrder = createOrder;
const getOrdersByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _req = req;
        const user_id = _req.userId;
        if (!user_id) {
            return next((0, http_errors_1.default)(401, "User not authenticated"));
        }
        const orders = yield purchases_model_1.default
            .find({ user_id })
            .populate("book_id", "title description cover_image price file genre");
        res.status(201).json({
            data: orders,
            message: "Orders Request Successfully .",
            status: 200,
        });
    }
    catch (err) {
        console.error(err);
        const error = (0, http_errors_1.default)(500, "Something Went Wrong While Getting Orders .");
        return next(error);
    }
});
exports.getOrdersByUserId = getOrdersByUserId;
