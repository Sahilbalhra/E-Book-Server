"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromCloudinaryByUrl = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const extractPublicIdFromUrl = (url) => {
    const urlParts = url.split("/");
    const fileWithExtension = urlParts.pop();
    const fileName = fileWithExtension === null || fileWithExtension === void 0 ? void 0 : fileWithExtension.split(".")[0]; // Remove file extension
    const publicId = urlParts.slice(urlParts.indexOf("upload") + 2).join(""); //getting folder name
    return `${publicId}/${fileName}`;
};
const deleteFileFromCloudinaryByUrl = (url) => {
    const publicId = extractPublicIdFromUrl(url);
    return new Promise((resolve, reject) => {
        cloudinary_1.default.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(`Failed to delete file: ${error.message}`);
            }
            else if (result.result !== "ok") {
                reject(`Failed to delete file: ${result.result}`);
            }
            else {
                resolve(result.result);
            }
        });
    });
};
exports.deleteFileFromCloudinaryByUrl = deleteFileFromCloudinaryByUrl;
