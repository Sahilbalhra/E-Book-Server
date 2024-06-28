import cloudinary from "../config/cloudinary";

const extractPublicIdFromUrl = (url: string): string => {
    const urlParts = url.split("/");
    const fileWithExtension = urlParts.pop();
    const fileName = fileWithExtension?.split(".")[0]; // Remove file extension
    const publicId = urlParts.slice(urlParts.indexOf("upload") + 2).join(""); //getting folder name
    return `${publicId}/${fileName}`;
};

export const deleteFileFromCloudinaryByUrl = (url: string): Promise<string> => {
    const publicId = extractPublicIdFromUrl(url);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(`Failed to delete file: ${error.message}`);
            } else if (result.result !== "ok") {
                reject(`Failed to delete file: ${result.result}`);
            } else {
                resolve(result.result);
            }
        });
    });
};
