"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const config_1 = require("./config");
cloudinary_1.v2.config({
    cloud_name: config_1.config.cloudinary_cloud,
    api_key: config_1.config.cloudinary_api_key,
    api_secret: config_1.config.cloudinary_api_secret,
});
exports.default = cloudinary_1.v2;
