import express, { Request } from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// import cors, { CorsOptions } from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./routes/user.router";
import bookRouter from "./routes/book.router";
// import { config } from "./config/config";
import reviewRouter from "./routes/review.router";
import purchaseRouter from "./routes/purchase.router";
import dashboardRouter from "./routes/dashboard.router";

// const allowedOrigins: string[] = [
//     config.frontendDomain || "",
//     config.frontendDomain2 || "",
// ];

// // CORS options
// const corsOptions: CorsOptions = {
//     origin: (
//         origin: string | undefined,
//         callback: (err: Error | null, allow?: boolean) => void
//     ) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true, // example for allowing cookies
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
// };

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

morgan.token("body", (req: Request) => {
    return JSON.stringify(req.body);
});
morgan.token("cookies", (req: Request) => {
    return JSON.stringify(req.cookies);
});

app.use(
    morgan((tokens, req, res) => {
        return [
            `Method: ${tokens.method(req, res)}`,
            `URL: ${tokens.url(req, res)}`,
            `Status: ${tokens.status(req, res)}`,
            `Content-Length: ${tokens.res(req, res, "content-length")}`,
            `- Response Time: ${tokens["response-time"](req, res)} ms`,
            `IP: ${tokens["remote-addr"](req, res)}`,
            `User-Agent: ${tokens["user-agent"](req, res)}`,
            `Timestamp: ${new Date().toISOString()}`,
            `Payload: ${tokens.body(req, res)}`,
            `Cookies: ${tokens.cookies(req, res)}`,
        ].join(" | ");
    })
);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to ebook apis." });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
app.use("/api/review", reviewRouter);
app.use("/api/order", purchaseRouter);
app.use("/api/dashboard", dashboardRouter);

//Global Error Handler
app.use(globalErrorHandler);

export default app;
