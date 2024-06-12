import express from "express";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./routes/userRouter";
import bookRouter from "./routes/bookRouter";
import { config } from "./config/config";

const app = express();
app.use(
    cors({
        origin: config.frontendDomain,
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to ebook apis." });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

//Global Error Handler
app.use(globalErrorHandler);

export default app;
