"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    const platform = req.header("X-Platform");
    if (platform !== "ADMIN" &&
        ((req.baseUrl.includes("book") && req.method === "GET") ||
            (req.method === "GET" && req.baseUrl.includes("review")))) {
        return next();
    }
    if (!token) {
        return next((0, http_errors_1.default)(401, "Authorization token is required."));
    }
    try {
        const parsedToken = token.split(" ")[1];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded = (0, jsonwebtoken_1.verify)(parsedToken, config_1.config.access_token_secret);
        const _req = req;
        _req.userId = decoded === null || decoded === void 0 ? void 0 : decoded._id;
        _req.isAdmin = platform === "ADMIN" ? true : false;
        next();
    }
    catch (err) {
        return next((0, http_errors_1.default)(401, "Token expired."));
    }
};
exports.default = authenticate;
