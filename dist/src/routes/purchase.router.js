"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const purchase_controller_1 = require("../controllers/purchase.controller");
const purchaseRouter = express_1.default.Router();
//routes
purchaseRouter.post("/", authenticate_1.default, purchase_controller_1.createOrder);
purchaseRouter.get("/", authenticate_1.default, purchase_controller_1.getOrdersByUserId);
exports.default = purchaseRouter;
