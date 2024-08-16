"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const book_router_1 = __importDefault(require("./routes/book.router"));
const config_1 = require("./config/config");
const review_router_1 = __importDefault(require("./routes/review.router"));
const purchase_router_1 = __importDefault(require("./routes/purchase.router"));
const dashboard_router_1 = __importDefault(require("./routes/dashboard.router"));
const allowedOrigins = [
    config_1.config.frontendDomain || "",
    config_1.config.frontendDomain2 || "",
];
// CORS options
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // example for allowing cookies
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "Welcome to ebook apis." });
});
app.use("/api/users", user_router_1.default);
app.use("/api/books", book_router_1.default);
app.use("/api/review", review_router_1.default);
app.use("/api/order", purchase_router_1.default);
app.use("/api/dashboard", dashboard_router_1.default);
//Global Error Handler
app.use(globalErrorHandler_1.default);
exports.default = app;
