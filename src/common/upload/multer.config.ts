import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(
    process.cwd(),
    "uploads"
);

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {
        recursive: true
    });

}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(
            null,
            uploadPath
        );

    },

    filename(req, file, cb) {

        cb(
            null,
            `${Date.now()}-${file.originalname}`
        );

    }

});

export const upload = multer({
    storage
});