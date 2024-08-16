"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const review_controller_1 = require("../controllers/review.controller");
const reviewRouter = express_1.default.Router();
//routes
reviewRouter.post("/:book_id", authenticate_1.default, review_controller_1.addReview);
reviewRouter.get("/:book_id", authenticate_1.default, review_controller_1.getReviewByBookId);
reviewRouter.delete("/:review_id", authenticate_1.default, review_controller_1.deleteReviewById);
exports.default = reviewRouter;
