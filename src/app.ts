import express from "express";
import cors from "cors";
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
