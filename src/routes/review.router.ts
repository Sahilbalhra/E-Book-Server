import express from "express";
import authenticate from "../middleware/authenticate";
import {
    addReview,
    getReviewByBookId,
    deleteReviewById,
} from "../controllers/review.controller";

const reviewRouter = express.Router();

//routes

reviewRouter.post("/:book_id", authenticate, addReview);
reviewRouter.get("/:book_id", authenticate, getReviewByBookId);
reviewRouter.delete("/:review_id", authenticate, deleteReviewById);

export default reviewRouter;
