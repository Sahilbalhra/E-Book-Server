import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../models/userModel";
import { UserDocument } from "../types/userTypes";

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

const generateAccessTokenAndRefreshToken = async (
    userId: string,
    next: NextFunction
): Promise<Tokens | void> => {
    try {
        const user = (await userModel.findById(userId)) as UserDocument | null;

        if (!user) {
            const error = createHttpError(
                400,
                "User Already exists with this email."
            );
            return next(error);
        }

        const accessToken: string = user.generateAccessToken();
        const refreshToken: string = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken: accessToken, refreshToken: refreshToken };
    } catch (err) {
        if (err instanceof Error) {
            const error = createHttpError(
                500,
                `Something went wrong while generating refresh and access tokens: ${err.message}`
            );
            return next(error);
        } else {
            const error = createHttpError(500, "An unknown error occurred.");
            return next(error);
        }
    }
};

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

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        const error = createHttpError(
            400,
            "User with this email does not exist."
        );
        return next(error);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        const error = createHttpError(401, "Invalid credentials");
        return next(error);
    }

    const tokens = await generateAccessTokenAndRefreshToken(
        user._id as string,
        next
    );

    if (!tokens) {
        return; // `next` was already called in case of error
    }
    const { accessToken, refreshToken } = tokens;

    const loggedInUser = await userModel
        .findById(user._id)
        .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            status: 200,
            data: { user: loggedInUser, accessToken, refreshToken },
            message: "User logged in successfully",
        });
};

export { createUser, userLogin };
