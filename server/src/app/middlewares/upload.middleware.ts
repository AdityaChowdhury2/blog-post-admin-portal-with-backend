import multer from "multer";
import path from "path";

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Multer configuration for image uploads
export const imageUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) cb(null, true);
        else cb(new Error("Only JPG, PNG, or WEBP images allowed"));
    },
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});