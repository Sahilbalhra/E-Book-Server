import fs from "fs";
import cloudinary from "../config/cloudinary";

const uploadOnCloudinary = async (
    localFilePath: string,
    filename_override: string,
    folder: string,
    format: string
) => {
    try {
        if (!localFilePath) {
            return null;
        }
        console.log("Uploading");

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            filename_override: filename_override,
            folder: folder,
            format: format,
        });
        console.log("response", response);
        //file has been uploaded successfully
        fs.unlinkSync(localFilePath); //remove the locally saved file as the upload operation got failed
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the locally saved file as the upload operation got failed
        return null;
    }
};

export default uploadOnCloudinary;
