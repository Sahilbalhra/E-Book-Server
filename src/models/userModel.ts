import { Schema, model } from "mongoose";
import { UserDocument } from "../types/userTypes";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/config";

const userSchema = new Schema<UserDocument>(
    {
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
    },
    { timestamps: true }
);

userSchema.pre<UserDocument>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        config.access_token_secret as string,
        {
            expiresIn: config.access_token_expiry,
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        config.refresh_token_secret as string,
        {
            expiresIn: config.refresh_token_expiry,
        }
    );
};

const userModel = model<UserDocument>("User", userSchema);

export default userModel;
