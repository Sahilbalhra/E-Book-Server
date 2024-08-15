import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import purchasesModel from "../models/purchases.model";
import bookModel from "../models/book.model";
import userModel from "../models/user.model";
import createHttpError from "http-errors";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { book_id, amount, quantity } = req.body;

    if (!book_id) {
        return next(createHttpError(401, "Book Id is required !"));
    }

    try {
        const _req = req as AuthRequest;
        const user_id = _req.userId;
        if (!user_id) {
            return next(createHttpError(401, "User not authenticated"));
        }

        const user = await userModel.findById(user_id);

        if (!user) {
            return next(createHttpError(401, "User not found!"));
        }

        const book = await bookModel.findById(book_id);

        if (!book) {
            return next(createHttpError(401, "Book not found!"));
        }

        const order = await purchasesModel.create({
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
    } catch (err) {
        console.error(err);
        const error = createHttpError(
            500,
            "Something Went Wrong While Create Order ."
        );
        return next(error);
    }
};

const getOrdersByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const _req = req as AuthRequest;
        const user_id = _req.userId;
        if (!user_id) {
            return next(createHttpError(401, "User not authenticated"));
        }

        const orders = await purchasesModel
            .find({ user_id })
            .populate(
                "book_id",
                "title description cover_image price file genre"
            );
        res.status(201).json({
            data: orders,
            message: "Orders Request Successfully .",
            status: 200,
        });
    } catch (err) {
        console.error(err);
        const error = createHttpError(
            500,
            "Something Went Wrong While Getting Orders ."
        );
        return next(error);
    }
};

export { createOrder, getOrdersByUserId };
