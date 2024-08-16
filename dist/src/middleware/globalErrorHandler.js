"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./../config/config");
const globalErrorHandler = (error, req, res) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        message: error.message,
        errorStack: config_1.config.env === "development" ? error.stack : "",
    });
};
exports.default = globalErrorHandler;
