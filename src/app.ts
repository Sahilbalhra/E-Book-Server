import express from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./routes/userRouter";
import bookRouter from "./routes/bookRouter";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to ebook apis." });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

//Global Error Handler
app.use(globalErrorHandler);

export default app;
