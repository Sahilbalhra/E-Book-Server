import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, "../../public/data/upload"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 3e7 },
});
