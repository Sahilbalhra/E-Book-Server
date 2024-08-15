import express from "express";
import authenticate from "../middleware/authenticate";
import { getDashBoardData } from "../controllers/dashboard.controller";

const dashboardRouter = express.Router();

dashboardRouter.get("/", authenticate, getDashBoardData);

export default dashboardRouter;
