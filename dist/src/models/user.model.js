"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config/config");
var UserRole;
(function (UserRole) {
    UserRole["User"] = "User";
    UserRole["Admin"] = "Admin";
    UserRole["Seller"] = "Seller";
})(UserRole || (UserRole = {}));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        index: true,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.User,
    },
    purchases: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Purchases",
    },
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, 10);
        next();
    });
});
userSchema.methods.isPasswordCorrect = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
userSchema.methods.generateAccessToken = function () {
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
    }, config_1.config.access_token_secret, {
        expiresIn: config_1.config.access_token_expiry,
    });
};
userSchema.methods.generateRefreshToken = function () {
    return jsonwebtoken_1.default.sign({
        _id: this._id,
    }, config_1.config.refresh_token_secret, {
        expiresIn: config_1.config.refresh_token_expiry,
    });
};
const userModel = (0, mongoose_1.model)("User", userSchema);
exports.default = userModel;
