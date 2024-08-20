import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
    userId: string;
    isAdmin: boolean;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    const platform = req.header("X-Platform");
    if (
        platform !== "ADMIN" &&
        ((req.baseUrl.includes("book") && req.method === "GET") ||
            (req.method === "GET" && req.baseUrl.includes("review")))
    ) {
        return next();
    }
    if (!token) {
        return next(createHttpError(401, "Authorization token is required."));
    }

    try {
        const parsedToken = token.split(" ")[1];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = verify(
            parsedToken,
            config.access_token_secret as string
        );
        const _req = req as AuthRequest;
        _req.userId = decoded?._id;
        _req.isAdmin = platform === "ADMIN" ? true : false;

        next();
    } catch (err) {
        return next(createHttpError(401, "Token expired."));
    }
};

export default authenticate;
