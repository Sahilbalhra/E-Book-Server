import express from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to ebook apis." });
});

//Global Error Handler
app.use(globalErrorHandler);

export default app;
