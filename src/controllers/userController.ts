import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../models/userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    const user = await userModel.findOne({ email: email });

    if (user) {
        const error = createHttpError(
            400,
            "User Already exists with this email."
        );
        return next(error);
    }

    const newUser = await userModel.create({
        name,
        email,
        password,
    });

    const createdUser = await userModel
        .findById(newUser._id)
        .select("-password -refreshToken");

    if (!createdUser) {
        const error = createHttpError(
            500,
            "Something went wrong while creating user."
        );
        return next(error);
    }

    return res.status(201).json({
        message: "User registered Successfully .",
        data: createdUser,
        status: 201,
    });
};

export { createUser };
