"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const _config = {
    port: process.env.PORT,
    databaseurl: process.env.MONGO_CONNECTION_URL,
    env: process.env.NODE_ENV,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,
    cloudinary_cloud: process.env.CLOUDINARY_CLOUD,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    frontendDomain: process.env.FRONTEND_DOMAIN,
    frontendDomain2: process.env.FRONTEND_DOMAIN_2,
};
exports.config = Object.freeze(_config);
