import express from "express";
import authenticate from "../middleware/authenticate";
import {
    createOrder,
    getOrdersByUserId,
} from "../controllers/purchaseController";

const purchaseRouter = express.Router();

//routes

purchaseRouter.post("/", authenticate, createOrder);
purchaseRouter.get("/", authenticate, getOrdersByUserId);

export default purchaseRouter;
