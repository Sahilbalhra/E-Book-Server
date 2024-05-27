import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "./config/config";

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to ebook apis." });
});

//Global Error Handler

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;

    return res.status(statusCode).json({
        message: error.message,
        errorStack: config.env === "development" ? error.stack : "",
    });
});

export default app;
