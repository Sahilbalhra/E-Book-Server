import express from "express";
import cors, { CorsOptions } from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./routes/userRouter";
import bookRouter from "./routes/bookRouter";
import { config } from "./config/config";

const allowedOrigins: string[] = [
    config.frontendDomain || "",
    config.frontendDomain2 || "",
];

// CORS options
const corsOptions: CorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // example for allowing cookies
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions));
// app.use(
//     cors({
//         origin: config.frontendDomain,
//     })
// );
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to ebook apis." });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

//Global Error Handler
app.use(globalErrorHandler);

export default app;
