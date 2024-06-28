import express from "express";
import authenticate from "../middleware/authenticate";
import { addReview, getReviewByBookId } from "../controllers/reviewController";

const reviewRouter = express.Router();

//routes

reviewRouter.post("/:book_id", authenticate, addReview);
reviewRouter.get("/:book_id", authenticate, getReviewByBookId);

export default reviewRouter;
