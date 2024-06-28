import express from "express";
import authenticate from "../middleware/authenticate";
import { addReview, getReviewByBookId } from "../controllers/reviewController";

const reviewRouter = express.Router();

//routes

reviewRouter.post("/:id", authenticate, addReview);
reviewRouter.get("/", authenticate, getReviewByBookId);

export default reviewRouter;
