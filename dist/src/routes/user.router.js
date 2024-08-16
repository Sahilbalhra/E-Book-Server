"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
//routes
userRouter.post("/register", user_controller_1.createUser);
userRouter.post("/login", user_controller_1.userLogin);
userRouter.post("/updateAccesstoken", user_controller_1.updateAccessToken);
exports.default = userRouter;
