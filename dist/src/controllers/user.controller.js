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
exports.updateAccessToken = exports.userLogin = exports.createUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
const generateAccessTokenAndRefreshToken = (userId, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield user_model_1.default.findById(userId));
        if (!user) {
            const error = (0, http_errors_1.default)(400, "User Already exists with this email.");
            return next(error);
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        yield user.save({ validateBeforeSave: false });
        return { accessToken: accessToken, refreshToken: refreshToken };
    }
    catch (err) {
        if (err instanceof Error) {
            const error = (0, http_errors_1.default)(500, `Something went wrong while generating refresh and access tokens: ${err.message}`);
            return next(error);
        }
        else {
            const error = (0, http_errors_1.default)(500, "An unknown error occurred.");
            return next(error);
        }
    }
});
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const error = (0, http_errors_1.default)(400, "All fields are required");
        return next(error);
    }
    const user = yield user_model_1.default.findOne({ email: email });
    if (user) {
        const error = (0, http_errors_1.default)(400, "User Already exists with this email.");
        return next(error);
    }
    const newUser = yield user_model_1.default.create({
        name,
        email,
        password,
    });
    const createdUser = yield user_model_1.default
        .findById(newUser._id)
        .select("-password -refreshToken");
    if (!createdUser) {
        const error = (0, http_errors_1.default)(500, "Something went wrong while creating user.");
        return next(error);
    }
    return res.status(201).json({
        message: "User registered Successfully .",
        data: createdUser,
        status: 201,
    });
});
exports.createUser = createUser;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        const error = (0, http_errors_1.default)(400, "All fields are required");
        return next(error);
    }
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        const error = (0, http_errors_1.default)(400, "User with this email does not exist.");
        return next(error);
    }
    const isPasswordValid = yield user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        const error = (0, http_errors_1.default)(401, "Invalid credentials");
        return next(error);
    }
    const tokens = yield generateAccessTokenAndRefreshToken(user._id, next);
    if (!tokens) {
        return; // `next` was already called in case of error
    }
    const { accessToken, refreshToken } = tokens;
    const loggedInUser = yield user_model_1.default
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
});
exports.userLogin = userLogin;
const updateAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        const error = (0, http_errors_1.default)(401, "unauthorized request.");
        return next(error);
    }
    try {
        const decodedToken = (0, jsonwebtoken_1.verify)(incomingRefreshToken, config_1.config.refresh_token_secret);
        const user = yield user_model_1.default.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id);
        if (!user) {
            const error = (0, http_errors_1.default)(400, "User with this email does not exist.");
            return next(error);
        }
        const options = {
            httpOnly: true,
            secure: true,
        };
        const tokens = yield generateAccessTokenAndRefreshToken(user._id, next);
        if (!tokens) {
            return; // `next` was already called in case of error
        }
        const { accessToken, refreshToken } = tokens;
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
            status: 200,
            data: { accessToken, refreshToken },
            message: "User logged in successfully",
        });
    }
    catch (error) {
        const err = (0, http_errors_1.default)(500, (error === null || error === void 0 ? void 0 : error.message) ? error.message : "Something went wrong");
        return next(err);
    }
});
exports.updateAccessToken = updateAccessToken;
