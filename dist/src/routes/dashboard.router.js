"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const dashboardRouter = express_1.default.Router();
dashboardRouter.get("/", authenticate_1.default, dashboard_controller_1.getDashBoardData);
exports.default = dashboardRouter;
